import { User } from "../../../../../../constants/localstorage";
import DashBoardAside from "../dashboard_aside";

export default function Students() {
  const user = localStorage.getItem(User);
  const { first_name,user_image } = user ? JSON.parse(user) : {};
  return (
    <div className="flex flex-row flex-1  w-full  p-15 gap-4" style={{ background: "var(--primary-blue)" }}>
      <div className="w-[20%] flex flex-col justify-center items-center ">
         <DashBoardAside name={first_name} pic={user_image}/>
      </div>
      <main className="bg-white flex flex-1  rounded-2xl shadow-md">
        asdsadada
      </main>
    </div>
  );
}
