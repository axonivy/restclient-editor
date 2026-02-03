import { Editor, type RestClientEditorProps } from './editor/Editor';

function App(props: RestClientEditorProps) {
  return <Editor {...props} />;
}

export default App;
