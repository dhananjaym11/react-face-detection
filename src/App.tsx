import WebcamDemo from './components/WebcamDemo';
import WebcamDemoOld from './components/WebcamDemoOld';
import ImageDemo from './components/ImageDemo';

const App = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <WebcamDemoOld />
    {/* <WebcamDemo />
    <ImageDemo /> */}
  </div>
);
export default App;
