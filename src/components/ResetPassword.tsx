"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { Formik } from "formik";
import { FaArrowRight, FaCheckCircle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useContext } from "react";
import AuthContext, { AuthContextType } from "@/context/authContext";
import swal from "sweetalert2";

type Props = {
  onComplete: () => void;
};

function ResetPassword({ onComplete }: Props) {
  const { changePassword } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="font-montserrat">
      <div className="pt-2 pb-10 px-6">
        <div className="py-8 space-y-4">
          <h2 className="text-4xl text-primary font-semibold">
            Reset Password
          </h2>
          <p className="text-gray-600">
            Enter your current password and set a new one
          </p>
        </div>

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validateOnBlur
          validateOnChange={false}
          validationSchema={Yup.object().shape({
            currentPassword: Yup.string().required("Current password required"),
            newPassword: Yup.string()
              .required("New password required")
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
            confirmPassword: Yup.string()
              .required("Please confirm your password")
              .oneOf([Yup.ref("newPassword")], "Passwords must match"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { currentPassword, newPassword } = values;
              await changePassword(currentPassword, newPassword);

              swal.fire({
                title: "Password Reset Successful",
                icon: "success",
                toast: true,
                timer: 3000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
              });

              onComplete();
            } catch (error: unknown) {
              let errorMessage = "Failed to reset password. Please try again.";

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
          }) => {
            const newPassword = values.newPassword;
            const passwordChecks = [
              {
                valid: newPassword.length >= 8,
                label: "At least 8 characters",
              },
              {
                valid: /[A-Z]/.test(newPassword),
                label: "One uppercase letter",
              },
              {
                valid: /[a-z]/.test(newPassword),
                label: "One lowercase letter",
              },
              {
                valid: /\d/.test(newPassword),
                label: "One number",
              },
              {
                valid: /[^A-Za-z0-9]/.test(newPassword),
                label: "One special character",
              },
              {
                valid: /^\S*$/.test(newPassword),
                label: "No spaces",
              },
            ];

            return (
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <Input
                    type="password"
                    name="currentPassword"
                    label="Current Password"
                    labelPlacement="outside"
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.currentPassword ? errors.currentPassword : ""
                    }
                  />

                  <Input
                    type="password"
                    name="newPassword"
                    label="New Password"
                    labelPlacement="outside"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.newPassword ? errors.newPassword : ""}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {passwordChecks.map((check, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-sm ${
                          check.valid ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {check.valid ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                        {check.label}
                      </div>
                    ))}
                  </div>

                  <Input
                    type="password"
                    name="confirmPassword"
                    label="Confirm New Password"
                    labelPlacement="outside"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmPassword ? errors.confirmPassword : ""
                    }
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
                    Reset Password
                  </Button>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default ResetPassword;
