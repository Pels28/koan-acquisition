import Button from "@/components/Button";

type IInstructionSentProps = {
  email: string;
  onClose?: () => void;
};

function InstructionSent({ email, onClose }: IInstructionSentProps) {
  return (
    <div className="space-y-8 pt-10 pb-6 px-6">
      <div className="flex flex-col w-full items-center justify-center space-y-4">
        <h2 className="text-4xl font-semibold">Instructions Sent!</h2>
        <p className="text-center">
          Check your email. A password reset link has been sent to &nbsp;
          <span className="font-semibold">{email}</span>
        </p>
      </div>

      <Button fullWidth color="primary" size="lg" onPress={onClose}>
        Okay
      </Button>
    </div>
  );
}

export default InstructionSent;
