const express = require("express");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const routes = require("./routes/index");
const cors = require("cors");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);
const { getUserId } = require("./utils/getUserId");
const passport = require("passport");
require("./utils/passport"); // Import passport configuration
const authRoutes = require("./routes/auth");

require("dotenv").config();

// Import GraphQL type definitions and resolvers
const typeDefs = require("./graphql/schema/index");
const resolvers = require("./graphql/resolvers/index");

// Get MongoDB connection string based on environment
const getMongoDBConnectionString = () => {
  // Use the MONGO_DATABASE environment variable if provided
  const database =
    process.env.MONGO_DATABASE ||
    (process.env.NODE_ENV === "test"
      ? "papiloomtest"
      : process.env.NODE_ENV === "production"
      ? "papiloomprod"
      : "papiloomdev");

  console.log(
    `Connecting to MongoDB database: ${database} in ${process.env.NODE_ENV} environment`
  );

  return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_URL}/${database}?retryWrites=true&w=majority`;
};

// Initialize test data if required
async function maybeInitializeTestData() {
  if (
    process.env.NODE_ENV === "test" &&
    process.env.INITIALIZE_TEST_DATA === "true"
  ) {
    console.log("Initializing test data...");
    try {
      const initTestData = require("./scripts/initTestData");
      await initTestData();
      console.log("Test data initialization completed");
    } catch (error) {
      console.error("Failed to initialize test data:", error);
    }
  }
}

async function startServer() {
  const app = express();

  // Allowed origins list
  const allowedOrigins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:4000",
    "https://papiloom.railway.app",
    "https://studio.apollographql.com",
    "https://papiloom.up.railway.app",
    "https://papiloom.com",
    "https://www.papiloom.com",
    "https://6157-74-14-45-89.ngrok-free.app/",
  ];

  // Configure CORS middleware
  app.use((req, res, next) => {
    const origin = req.header("Origin");

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin); // Dynamically set the origin
      res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, OPTIONS, PUT, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Expose-Headers",
        "ETag, x-amz-meta-custom-header"
      );

      // OPTIONAL: Specify preflight cache duration
      res.setHeader("Access-Control-Max-Age", "600"); // Cache preflight response for 10 minutes
    } else if (origin) {
      console.warn(`CORS: Origin not allowed - ${origin}`); // Log for debugging
    }

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.sendStatus(204); // No content for preflight
    }

    next();
  });

  // Initialize Passport middleware
  app.use(passport.initialize());

  // Middleware to capture raw body for specific webhook routes
  app.use((req, res, next) => {
    // Check if the request is to one of your webhook endpoints
    if (
      req.originalUrl === "/stripe/webhook" ||
      req.originalUrl === "/razorpay/webhook" ||
      req.originalUrl === "/zoho-email-webhook"
    ) {
      // Use express's raw middleware to parse the body
      express.raw({ type: "*/*" })(req, res, (err) => {
        if (err) {
          return next(err);
        }
        req.rawBody = req.body; // Assign the raw body as Buffer to req.rawBody
        next();
      });
    } else {
      next(); // Proceed to the next middleware if not a webhook endpoint
    }
  });

  // Use cookie-parser middleware
  app.use(cookieParser());
  // Use other middlewares
  app.use(express.json({ limit: "50mb" }));
  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  // Serve static files
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use("/public", express.static(path.join(__dirname, "public")));

  const httpServer = createServer(app);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: ({ req, res }) => ({ req, res, getUserId }), // Ensure getUserId is included in the context
    },
    wsServer
  );

  const apolloServer = new ApolloServer({
    uploads: false,
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: ({ req, res }) => {
      return { req, res, getUserId };
    },
    playground: {
      settings: {
        "editor.theme": "dark",
      },
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false }); // Disable Apollo's internal CORS handling

  // Apply Express routes
  app.use("/", routes);

  // Add Google and Facebook auith to Express
  app.use("/", authRoutes);

  // Serve client-side app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  });

  // Connect to MongoDB
  mongoose
    .connect(getMongoDBConnectionString(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log("MongoDB Connected");

      // Initialize test data if needed
      await maybeInitializeTestData();

      // Start the server after MongoDB connection is established
      const PORT = process.env.PORT || 4000;
      httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
      });
    })
    .catch((err) => console.log(err));
}

startServer();
