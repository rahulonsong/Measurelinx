/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
// import CustomButtonPlugin from './customButtonPlugin.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js';
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import DocumentList from '@ckeditor/ckeditor5-list/src/documentlist.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace.js';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import MediaEmbedToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar.js';
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters.js';
import SpecialCharactersArrows from '@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows.js';
import SpecialCharactersCurrency from '@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency.js';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js';
import SpecialCharactersLatin from '@ckeditor/ckeditor5-special-characters/src/specialcharacterslatin.js';
import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical.js';
import SpecialCharactersText from '@ckeditor/ckeditor5-special-characters/src/specialcharacterstext.js';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript.js';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableCaption from '@ckeditor/ckeditor5-table/src/tablecaption.js';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableColumnResize from '@ckeditor/ckeditor5-table/src/tablecolumnresize.js';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  // CustomButtonPlugin,
  Alignment,
  AutoImage,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  DocumentList,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  PageBreak,
  Paragraph,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
];

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'undo',
      'redo',
      '|',
      'bold',
      'underline',
      'strikethrough',
      'italic',
      'removeFormat',
      '|',
      'fontFamily',
      'fontColor',
      'fontBackgroundColor',
      'fontSize',
      '|',
      'indent',
      'outdent',
      'alignment',
      'numberedList',
      'bulletedList',
      'blockQuote',
      '|',
      'imageInsert',
      'imageUpload',
      'link',
      '|',
      'insertTable',
      '|',
      'horizontalLine',
      'pageBreak',
      'superscript',
      'subscript',
      'specialCharacters',
      'findAndReplace',
      '|',
      // 'customButton',
    ],
  },
  language: 'en',
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      'linkImage',
    ],
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties',
    ],
  },
  fontColor: {
    colors: [
      { color: 'hsl(180, 66%, 50%)', label: 'Aqua' },
      { color: 'hsl(0, 0%, 0%)', label: 'Automatic' },
      { color: 'hsl(0, 0%, 0%)', label: 'Black' },
      { color: 'hsl(240, 100%, 50%)', label: 'Blue' },
      { color: 'hsl(240, 14%, 50%)', label: 'BlueGray' },
      { color: 'hsl(120, 100%, 50%)', label: 'BrightGreen' },
      { color: 'hsl(24, 67%, 40%)', label: 'Brown' },
      { color: 'hsl(240, 100%, 25%)', label: 'DarkBlue' },
      { color: 'hsl(120, 100%, 10%)', label: 'DarkGreen' },
      { color: 'hsl(0, 100%, 25%)', label: 'DarkRed' },
      { color: 'hsl(198, 61%, 20%)', label: 'DarkTeal' },
      { color: 'hsl(60, 100%, 25%)', label: 'DarkYellow' },
      { color: 'hsl(48, 100%, 50%)', label: 'Gold' },
      { color: 'hsl(0, 0%, 95%)', label: 'Gray05' },
      { color: 'hsl(0, 0%, 90%)', label: 'Gray10' },
      { color: 'hsl(0, 0%, 88%)', label: 'Gray125' },
      { color: 'hsl(0, 0%, 85%)', label: 'Gray15' },
      { color: 'hsl(0, 0%, 80%)', label: 'Gray20' },
      { color: 'hsl(0, 0%, 75%)', label: 'Gray25' },
      { color: 'hsl(0, 0%, 70%)', label: 'Gray30' },
      { color: 'hsl(0, 0%, 65%)', label: 'Gray35' },
      { color: 'hsl(0, 0%, 63%)', label: 'Gray375' },
      { color: 'hsl(0, 0%, 60%)', label: 'Gray40' },
      { color: 'hsl(0, 0%, 55%)', label: 'Gray45' },
      { color: 'hsl(0, 0%, 50%)', label: 'Gray50' },
      { color: 'hsl(0, 0%, 45%)', label: 'Gray55' },
      { color: 'hsl(0, 0%, 40%)', label: 'Gray60' },
      { color: 'hsl(0, 0%, 38%)', label: 'Gray625' },
      { color: 'hsl(0, 0%, 35%)', label: 'Gray65' },
      { color: 'hsl(0, 0%, 30%)', label: 'Gray70' },
      { color: 'hsl(0, 0%, 25%)', label: 'Gray75' },
      { color: 'hsl(0, 0%, 20%)', label: 'Gray80' },
      { color: 'hsl(0, 0%, 15%)', label: 'Gray85' },
      { color: 'hsl(0, 0%, 13%)', label: 'Gray875' },
      { color: 'hsl(0, 0%, 10%)', label: 'Gray90' },
      { color: 'hsl(0, 0%, 5%)', label: 'Gray95' },
      { color: 'hsl(120, 100%, 25%)', label: 'Green' },
      { color: 'hsl(240, 33%, 40%)', label: 'Indigo' },
      { color: 'hsl(270, 100%, 80%)', label: 'Lavender' },
      { color: 'hsl(225, 100%, 60%)', label: 'LightBlue' },
      { color: 'hsl(120, 100%, 80%)', label: 'LightGreen' },
      { color: 'hsl(36, 100%, 50%)', label: 'LightOrange' },
      { color: 'hsl(180, 100%, 90%)', label: 'LightTurquoise' },
      { color: 'hsl(60, 100%, 80%)', label: 'LightYellow' },
      { color: 'hsl(79, 100%, 50%)', label: 'Lime' },
      { color: 'hsl(60, 100%, 10%)', label: 'OliveGreen' },
      { color: 'hsl(24, 100%, 50%)', label: 'Orange' },
      { color: 'hsl(210, 100%, 80%)', label: 'PaleBlue' },
      { color: 'hsl(300, 100%, 50%)', label: 'Pink' },
      { color: 'hsl(330, 50%, 40%)', label: 'Plum' },
      { color: 'hsl(0, 100%, 50%)', label: 'Red' },
      { color: 'hsl(340, 100%, 80%)', label: 'Rose' },
      { color: 'hsl(150, 50%, 40%)', label: 'SeaGreen' },
      { color: 'hsl(197, 100%, 50%)', label: 'SkyBlue' },
      { color: 'hsl(30, 100%, 80%)', label: 'Tan' },
      { color: 'hsl(180, 100%, 25%)', label: 'Teal' },
      { color: 'hsl(180, 100%, 50%)', label: 'Turquoise' },
      { color: 'hsl(300, 100%, 25%)', label: 'Violet' },
      { color: 'hsl(0, 0%, 100%)', label: 'White' },
      { color: 'hsl(60, 100%, 50%)', label: 'Yellow' },
    ],
    colorPicker: true,
  },
  fontBackgroundColor: {
    colors: [
      { color: 'hsl(180, 66%, 50%)', label: 'Aqua' },
      { color: 'hsl(0, 0%, 0%)', label: 'Automatic' },
      { color: 'hsl(0, 0%, 0%)', label: 'Black' },
      { color: 'hsl(240, 100%, 50%)', label: 'Blue' },
      { color: 'hsl(240, 14%, 50%)', label: 'BlueGray' },
      { color: 'hsl(120, 100%, 50%)', label: 'BrightGreen' },
      { color: 'hsl(24, 67%, 40%)', label: 'Brown' },
      { color: 'hsl(240, 100%, 25%)', label: 'DarkBlue' },
      { color: 'hsl(120, 100%, 10%)', label: 'DarkGreen' },
      { color: 'hsl(0, 100%, 25%)', label: 'DarkRed' },
      { color: 'hsl(198, 61%, 20%)', label: 'DarkTeal' },
      { color: 'hsl(60, 100%, 25%)', label: 'DarkYellow' },
      { color: 'hsl(48, 100%, 50%)', label: 'Gold' },
      { color: 'hsl(0, 0%, 95%)', label: 'Gray05' },
      { color: 'hsl(0, 0%, 90%)', label: 'Gray10' },
      { color: 'hsl(0, 0%, 88%)', label: 'Gray125' },
      { color: 'hsl(0, 0%, 85%)', label: 'Gray15' },
      { color: 'hsl(0, 0%, 80%)', label: 'Gray20' },
      { color: 'hsl(0, 0%, 75%)', label: 'Gray25' },
      { color: 'hsl(0, 0%, 70%)', label: 'Gray30' },
      { color: 'hsl(0, 0%, 65%)', label: 'Gray35' },
      { color: 'hsl(0, 0%, 63%)', label: 'Gray375' },
      { color: 'hsl(0, 0%, 60%)', label: 'Gray40' },
      { color: 'hsl(0, 0%, 55%)', label: 'Gray45' },
      { color: 'hsl(0, 0%, 50%)', label: 'Gray50' },
      { color: 'hsl(0, 0%, 45%)', label: 'Gray55' },
      { color: 'hsl(0, 0%, 40%)', label: 'Gray60' },
      { color: 'hsl(0, 0%, 38%)', label: 'Gray625' },
      { color: 'hsl(0, 0%, 35%)', label: 'Gray65' },
      { color: 'hsl(0, 0%, 30%)', label: 'Gray70' },
      { color: 'hsl(0, 0%, 25%)', label: 'Gray75' },
      { color: 'hsl(0, 0%, 20%)', label: 'Gray80' },
      { color: 'hsl(0, 0%, 15%)', label: 'Gray85' },
      { color: 'hsl(0, 0%, 13%)', label: 'Gray875' },
      { color: 'hsl(0, 0%, 10%)', label: 'Gray90' },
      { color: 'hsl(0, 0%, 5%)', label: 'Gray95' },
      { color: 'hsl(120, 100%, 25%)', label: 'Green' },
      { color: 'hsl(240, 33%, 40%)', label: 'Indigo' },
      { color: 'hsl(270, 100%, 80%)', label: 'Lavender' },
      { color: 'hsl(225, 100%, 60%)', label: 'LightBlue' },
      { color: 'hsl(120, 100%, 80%)', label: 'LightGreen' },
      { color: 'hsl(36, 100%, 50%)', label: 'LightOrange' },
      { color: 'hsl(180, 100%, 90%)', label: 'LightTurquoise' },
      { color: 'hsl(60, 100%, 80%)', label: 'LightYellow' },
      { color: 'hsl(79, 100%, 50%)', label: 'Lime' },
      { color: 'hsl(60, 100%, 10%)', label: 'OliveGreen' },
      { color: 'hsl(24, 100%, 50%)', label: 'Orange' },
      { color: 'hsl(210, 100%, 80%)', label: 'PaleBlue' },
      { color: 'hsl(300, 100%, 50%)', label: 'Pink' },
      { color: 'hsl(330, 50%, 40%)', label: 'Plum' },
      { color: 'hsl(0, 100%, 50%)', label: 'Red' },
      { color: 'hsl(340, 100%, 80%)', label: 'Rose' },
      { color: 'hsl(150, 50%, 40%)', label: 'SeaGreen' },
      { color: 'hsl(197, 100%, 50%)', label: 'SkyBlue' },
      { color: 'hsl(30, 100%, 80%)', label: 'Tan' },
      { color: 'hsl(180, 100%, 25%)', label: 'Teal' },
      { color: 'hsl(180, 100%, 50%)', label: 'Turquoise' },
      { color: 'hsl(300, 100%, 25%)', label: 'Violet' },
      { color: 'hsl(0, 0%, 100%)', label: 'White' },
      { color: 'hsl(60, 100%, 50%)', label: 'Yellow' },
    ],
    colorPicker: true,
  },
  shouldNotGroupWhenFull: true,
};

export default Editor;
