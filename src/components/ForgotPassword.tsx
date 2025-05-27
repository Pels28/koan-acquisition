import Button from "@/components/Button";
import Input from "@/components/Input";
import { Formik } from "formik";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import * as Yup from "yup";

type Props = {
  onClose?: () => void;
  onComplete: (email: string) => void;
};

function ForgotPassword({ onComplete }: Props) {
  // const dispatch = useDispatch();
  // const { isLoading, isError, isSuccess, message } = useSelector(
  //   (state) => state.auth
  // );

  return (
    <div className="font-montserrat">
      <div className="pt-2 pb-10 px-6">
        <div className="py-8 space-y-4">
          <h2 className="text-4xl text-primary font-semibold">
            Forgot your Password?
          </h2>
          <p>
            Enter the email address or mobile number you are registered with,
            and you will receive the password reset instructions.
          </p>
        </div>

        <Formik
          initialValues={{
            email: "", // can be phone or email
          }}
          validateOnBlur
          validateOnChange={false}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .trim()
              .email("Invalid email address")
              .required("Email required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const { email } = values;
            try {
              // await dispatch(resetPassword({ email })).unwrap();
              onComplete(email);
            } catch (error: unknown) {
              let errorMessage =
                "Failed to send reset instructions to your email";

              if (typeof error === "string") {
                errorMessage = error;
              } else if (error instanceof Error) {
                errorMessage = error.message;
              }

              toast.error(errorMessage);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleSubmit,
            handleBlur,
            handleChange,
            values,
            isSubmitting,
            errors,
            touched,
          }) => (
            <form className="space-y-7" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  labelPlacement="outside"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : ""}
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  color="primary"
                  endContent={<FaArrowRight className="w-5 h-5" />}
                  fullWidth
                  size="lg"
                  isLoading={isSubmitting}
                >
                  Send
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>

      {/* <div className="text-center bg-primary-lighter py-6">
        Invited for a family tree? <span  className="font-semibold px-2 text-primary">Register with invitation code</span>
      </div> */}
    </div>
  );
}

export default ForgotPassword;
