import CVPage from './components/CVPage';
import EditMenu from './components/EditMenu';

function App() {
  return (
    <div className="min-h-screen flex">
      <EditMenu></EditMenu>
      <div className="w-6/12 flex justify-center items-center">
        <CVPage></CVPage>
      </div>
    </div>
  );
}

export default App;
