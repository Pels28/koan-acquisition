"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { Formik } from "formik";
import { FaArrowRight, FaCheckCircle, FaTimes } from "react-icons/fa";
// import { toast } from "react-toastify";
import * as Yup from "yup";
import { useContext } from "react";
import AuthContext, { AuthContextType } from "@/context/authContext";
import swal from "sweetalert2";

interface ISignUpProps {
  onComplete: () => void;
}

const SignUp = ({ onComplete }: ISignUpProps) => {
  const { registerUser } = useContext(AuthContext) as AuthContextType;
  // const dispatch = useDispatch()
  // const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  // useEffect(() => {
  //   if (isError) {
  //     toast.error(<div>message</div>)
  //   }
  // }, [isError, message])

  return (
    <div className="text-secondary overflow-auto">
      <div className="pt-2 pb-5 px-3 sm:pb-10 sm:px-6">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "", // email
            password: "",
          }}
          validateOnBlur
          validateOnChange={false}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().trim().required("First name required"),
            lastName: Yup.string().trim().required("Last name required"),
            email: Yup.string()
              .trim()
              .email("Invalid email")
              .required("Email required"),
            password: Yup.string()
              .required("Password required")
              .min(8, "Password must be at least 8 characters")
              .matches(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
              )
              .matches(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
              )
              .matches(/\d/, "Password must contain at least one number")
              .matches(
                /[^A-Za-z0-9]/,
                "Password must contain at least one special character"
              )
              .matches(/^\S*$/, "Password must not contain spaces"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const {
                email,
                firstName: first_name,
                lastName: last_name,
                password,
              } = values;

              await registerUser(first_name, last_name, email, password);
              swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 3000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
              });

              // await dispatch(register(userData)).unwrap();
              // dispatch(reset());
              onComplete();
            } catch (error: unknown) {
              let errorMessage =
                "Registration failed. Please check your details.";

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
                timer: 6000,
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
          }) => {
            const password = values.password;

            const passwordChecks = [
              {
                valid: password.length >= 8,
                label: "Password has at least 8 characters.",
              },
              {
                valid: /[^A-Za-z0-9]/.test(password),
                label: "Password has special characters.",
              },
              {
                valid: /\d/.test(password),
                label: "Password has a number.",
              },
              {
                valid: /[A-Z]/.test(password),
                label: "Password has a capital letter.",
              },
              {
                valid: /^\S*$/.test(password),
                label: "Password contains no spaces.",
              },
            ];

            return (
              <form className="space-y-7" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      type="text"
                      name="firstName"
                      label="First Name"
                      labelPlacement="outside"
                      size="lg"
                      radius="md"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName ? errors.firstName : ""}
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      type="text"
                      name="lastName"
                      label="Last Name"
                      labelPlacement="outside"
                      size="lg"
                      radius="md"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName ? errors.lastName : ""}
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      name="email"
                      label="Email"
                      type="email"
                      labelPlacement="outside"
                      radius="md"
                      size="lg"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email ? errors.email : ""}
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      name="password"
                      label="Password"
                      type="password"
                      labelPlacement="outside"
                      radius="md"
                      size="lg"
                      value={password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password ? errors.password : ""}
                    />
                    <ul className="font-montserrat mt-4 space-y-2">
                      {passwordChecks.map((check, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center gap-2 ${
                            check.valid ? "text-black" : "text-gray-500"
                          }`}
                        >
                          {check.valid ? (
                            <FaCheckCircle className="text-green-600 h-5 w-5" />
                          ) : (
                            <FaTimes className="text-red-500 h-5 w-5" />
                          )}
                          {check.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 col-span-2">
                    <Button
                      type="submit"
                      color="primary"
                      endContent={<FaArrowRight className="w-5 h-5" />}
                      fullWidth
                      size="lg"
                      isLoading={isSubmitting}
                      radius="md"
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
