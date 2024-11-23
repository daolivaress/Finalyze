import Aside from "../../components/common/Aside/Aside";
import Drawner from "../../components/common/Drawner/Drawner";

const BaseLayout = ({ children }:any) => {
  return (
    <div className="md:flex">
      <Drawner/>
      <Aside />
      <main className="w-full mb-8">{children}</main>
    </div>
  );
};

export default BaseLayout;
