import SignIn from "@/components/SignIn";
import Logo from "@public/images/koan-logo.jpg";
import Image from "next/image";

const Login = () => {
  return (
    <div className="w-[50%] mx-auto pt-7">
      <div className="shadow-lg border-1 text-center py-5 px-4">
        <div className="text-primary font-montserrat text-[35px]">
          <i>
            KO<span className="text-secondary">A</span>N PETROLE
            <span className="text-secondary">U</span>M
          </i>
        </div>

        <strong>Always on your way!</strong>

        <div className="p-1 mt-2 bg-primary">
          <div className="relative w-full h-[160px] ">
            <Image src={Logo} className="rounded-lg" alt="logo" fill priority />
          </div>
        </div>

        <div className="mt-4">
          <SignIn />
        </div>
      </div>

      <div className="text-center my-4">
        <div className="text-primary flex justify-center font-montserrat text-sm">
          <i>
            KO<span className="text-secondary">A</span>N PETROLE
            <span className="text-secondary">U</span>M
          </i>&nbsp;
        <span className="text-black">- copyright 2025</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
