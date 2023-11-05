import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import NavBar from './components/NavBar';




function Home() {
  return (
    <div>
      <NavBar/>
      <h1>Home Page</h1>
    </div>
  )
}

// function Login(){
//   return(
//     <div>
//       <h1>Login Page</h1>
//     </div>
//   )
// }

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    
    <Home/>
  );
}

export default App;
