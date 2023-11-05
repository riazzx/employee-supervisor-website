import { Navbar, NavbarBrand } from 'reactstrap';

function NavBar(){
  return(
    <div>
       <Navbar
    className="my-0"
    color="secondary"
    dark
  >
    <NavbarBrand href="/">
      Employee Superviors
    </NavbarBrand>
  </Navbar>
    </div>
  )
}


export default NavBar;