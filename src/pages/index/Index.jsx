
import "./index.css"
import Contacts from "~/components/Contact"
import Feeds from "~/components/Feeds"

const Index = () => {
  return (
    <>
      <div className="main-content-index">
        <Feeds />
      </div>
      <Contacts />
   </>
  );
};


export default Index;