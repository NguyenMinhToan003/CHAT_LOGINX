
import "./index.css";
import Contacts from "../components/Contact";
import Sidebar from "../components/SideBar";
import Feeds from "../components/Feeds";

const Index = () => {
  return (
    <div className="home-page">
      <Sidebar />
      <div className="main-content-index">
        <Feeds />
      </div>
      <Contacts />
    </div>
  );
};

// Sidebar Component







// Contacts Component


export default Index;