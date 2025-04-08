Function estimateGasVisc(T As Double)

    Application.Run "SubStart.SubStart"
                        
    Dim i As Integer, j As Integer
    Dim X(1 To 25) As Double
    Dim Y(1 To 25) As Double
    Dim Pc(1 To 25) As Double
    Dim Tc(1 To 25) As Double
    Dim M(1 To 25) As Double
    Dim k(1 To 25) As Double
    Dim vis(1 To 25) As Double
    Dim Tr(1 To 25) As Double
    Dim N(1 To 25) As Double
    Dim w(1 To 25) As Double
    Dim Q(1 To 25, 1 To 25) As Double, QSum As Double, visAvg As Double
    
    Dim tol As Double, Fraction As String, P As Double
    
    
    tol = 1E-300
    
    If LCase(ws_General.Range("E" & "$" & RefRow + "67").Value) = "" Then
    
    
        P = ((ws_General.Range("E" & "$" & RefRow + "20").Value - ws_PDAndLT.Range("F25").Value) / 1.033 + 1) * 1.01325 * 10 ^ 5
        
    Else
    
    
    P = (ws_General.Range("E" & "$" & RefRow + "67").Value / 1.033 + 1) * 1.01325 * 10 ^ 5
    
    End If
                
    Fraction = ws_DPBP.Cells(13, 5)


    For i = 1 To 25
        If ws_DPBP.Cells(i + 13, 18) = 0 Then Exit For
        If Fraction = "Mole-fraction or percentage" Then

            X(i) = ws_DPBP.Cells(i + 13, 21)
    
        Else
    
            X(i) = ws_DPBP.Cells(i + 13, 20)
        
        End If
            
        M(i) = ws_DPBP.Cells(i + 13, 18)
        Pc(i) = ws_DPBP.Cells(i + 13, 13)
        Tc(i) = ws_DPBP.Cells(i + 13, 12)
        w(i) = ws_DPBP.Cells(i + 13, 11)
        Tr(i) = Tc(i) / T
        
            'Evaluating individual component viscosity
            
        With Application.WorksheetFunction
            
            If Tr(i) <= 1.5 Then
            
                N(i) = 0.00034 * .Power(Tr(i), 0.94)
                
            Else
            
            N(i) = 0.0001778 * .Power((4.58 * Tr(i) - 1.67), 0.625)
                        
            End If
            
            vis(i) = 0.00046 * N(i) * .Power(M(i), 0.5) * .Power(Pc(i), (2 / 3)) / .Power(Tc(i), (1 / 6))
            
        End With
        
    Next i

    For i = 1 To 25
        If ws_DPBP.Cells(i + 13, 18) = 0 Then Exit For
        For j = 1 To 25
            If ws_DPBP.Cells(j + 13, 18) = 0 Then Exit For
            With Application.WorksheetFunction
            
                Q(i, j) = (1 + .Power(.Power(vis(i) / vis(j), (1 / 2)) * .Power(M(j) / M(i), (1 / 4)), 2)) / (.Power(8, (1 / 2)) * .Power(1 + M(i) / M(j), (1 / 2)))
                
            End With
        Next j

    Next i
    
    visAvg = 0
    For i = 1 To 25
        If ws_DPBP.Cells(i + 13, 18) = 0 Then Exit For
        QSum = 0
        For j = 1 To 25
            If ws_DPBP.Cells(j + 13, 18) = 0 Then Exit For
            If j <> i Then

                QSum = QSum + Q(i, j) * (X(j) / X(i))

            End If
                
        Next j

        visAvg = visAvg + (vis(i) / (1 + QSum))

    Next i
    
    estimateGasVisc = visAvg

    Application.Run "SubEnd.SubEnd"


End Function


