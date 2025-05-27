import Button from "@/components/Button";
import { useEffect, useState } from "react";

type IVerificationSentProps = {
  email: string;
  onClose?: () => void;
};

function VerificationSent({ email, onClose }: IVerificationSentProps) {
  const [timer, setTimer] = useState(0);

  //   const sendActivationLink = async () => {
  //     try {
  //       const response = await requestActivationLink({email: email})
  //       toast.success("Activation link has been sent to your email")
  //       setTimer(300)
  //     } catch (error: AxiosError | any) {
  //       toast.error(error?.message)
  //       setTimer(300)
  //     }
  //   }

  
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};


  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    setTimer(300);
    startTimer();
  }, []);

  return (
    <div className="space-y-8 pt-10 pb-6 px-6">
      <div className="flex flex-col w-full items-center justify-center space-y-4">
        <h2 className="text-4xl font-semibold">Verify your Email</h2>
        <p className="text-center">
          To verify your email, click the link that was sent to &nbsp;
          <span className="font-semibold">{email}</span>
        </p>
      </div>
      <Button size="lg" isDisabled={timer > 0} fullWidth>
        Resend link {timer > 0 && "in " + formatTime(timer)}
      </Button>

      <Button fullWidth color="secondary" size="lg" onPress={onClose}>
        Okay
      </Button>
    </div>
  );
}

export default VerificationSent;
