import React, { useEffect, useState } from "react";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
  CompositeDecorator,
  convertFromRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { convertMdToDraft } from "./markdown";

const initialState = {
  editorState: EditorState.createEmpty(),
};

function App() {
  function findImageEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return entityKey !== null;
    }, callback);
  }

  const img = document.createElement("img");
  const sampleMarkup = '<img src="./1.jpg" />';

  let newRawContent = { key: "vaxinak", entityMap: {} };
  let newContentState = convertFromRaw(newRawContent);

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(newContentState)
  );

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={setEditorState}
      handleDroppedFiles={(selection, files) => {
        console.log(selection, files);

        const sampleMarkup = "<p>Hello world</p>";
        const blocksFromHTML = convertFromHTML(sampleMarkup);
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );

        const fileReader = new FileReader();
        fileReader.addEventListener(
          "load",
          function () {
            const Image = (props) => {
              console.log(props);
              const { height, src, width } = props.contentState
                .getEntity(props.entityKey)
                .getData();
              return <img src={src} height={height} width={width} />;
            };

            const decorator = new CompositeDecorator([
              {
                strategy: findImageEntities,
                component: <Image src={fileReader.result} />,
              },
            ]);

            const sampleMarkup =
              '<img src="' +
              fileReader.result +
              '" height="112" width="200" />';
            const img = document.createElement("img");
            img.src = fileReader.result;
            document.body.appendChild(img);

            const blocksFromHTML = convertFromHTML(sampleMarkup);

            const state = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );

            console.log(decorator);
            setEditorState(EditorState.createWithContent(state, decorator));
          },
          false
        );
        fileReader.readAsDataURL(files[0]);
      }}
    />
  );
}

export default App;

// var dropArea = document.getElementById("dropArea");

// function handleDragOver(e) {
//   e.preventDefault();
//   e.stopPropagation();
// }

// function handleDrop(e) {
//   e.preventDefault();
//   e.stopPropagation();

//   var data = e.dataTransfer,
//     files = data.files;
//   console.log(files);

//   const fileReader = new FileReader();
//   fileReader.addEventListener(
//     "load",
//     function () {
//       return "<img src=>""
//     },
//     false
//   );
//   fileReader.readAsDataURL(files[0]);
// }

// <div
//       className="App"
//       style={{ minHeight: "300px", border: "3px solid red" }}
//       id="dropArea"
// onDrop={handleDrop}
// onDragOver={handleDragOver}
//     ></div>
