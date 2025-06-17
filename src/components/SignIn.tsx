"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Formik } from "formik";
import { FaArrowRight } from "react-icons/fa6";
import * as Yup from "yup";
import swal from "sweetalert2"


// import { toast } from "react-toastify";
import { useContext, } from "react";
import AuthContext, { AuthContextType } from "@/context/authContext";

interface ISignInProps {
  onClose?: () => void;
  onComplete: () => void;
}

const SignIn = ({ onComplete }: ISignInProps) => {
  const { loginUser } = useContext(AuthContext) as AuthContextType;
  // const dispatch = useDispatch()
  // const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  // useEffect(() => {
  //   if (isError) {
  //     toast.error(<div>message</div>)
  //   }
  // }, [isError, message])

  return (
    <div className="text-primary overflow-auto">
      <div className="pt-2 pb-10 px-6">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validateOnBlur
          validateOnChange={false}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .trim()
              .email("Inavlid email")
              .required("Email is required"),
            password: Yup.string().trim().required("Password required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // await dispatch(login(values)).unwrap();
              // await dispatch(getUserInfo()).unwrap();
              await loginUser(values.email, values.password);
              swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
              });
              onComplete();
            } catch (error: unknown) {
              let errorMessage = "Login failed. Please try again.";

              // Use the message from rejectWithValue
              if (typeof error === "string") {
                errorMessage = error;
              } else if (error instanceof Error) {
                errorMessage = error.message;
              }

              // toast.error(errorMessage);
              swal.fire({
                title: errorMessage,
                icon: "error",
                toast: true,
                timer: 3000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <form className="space-y-7" onSubmit={handleSubmit}>
              <div className="space-y-10">
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  value={values.email}
                  // placeholder="type email.."
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  labelPlacement="outside"
                  error={touched.email ? errors.email : ""}
                />
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : ""}
                  size="lg"
                  labelPlacement="outside"
                />
              </div>
              <div className="space-y-4">
                <Button
                  type="submit"
                  radius="md"
                  color="primary"
                  endContent={<FaArrowRight className="w-5 h-5" />}
                  fullWidth
                  size="lg"
                  isLoading={isSubmitting}
                >
                  Login
                </Button>

                {/* <div>
                  <div
                    onClick={() => {
                      window.history.pushState(
                        {},
                        "",
                        `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.resetPassword}`
                      );
                    }}
                    className="text-primary font-semibold flex justify-center items-center gap-x-1 cursor-pointer w-fit mx-auto"
                  >
                    <span>
                      <TbLockQuestion className="w-5 h-5" />
                    </span>
                    Reset your  password
                  </div>
                </div> */}

                <div className="text-center font-montserrat text-black ">
                  Not having an account yet?
                  <p
                    className="font-bold px-2 cursor-pointer hover:text-primary"
                    onClick={() => {}}
                  >
                    Register Here
                  </p>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
