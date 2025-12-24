import { useState } from "react";
import { PrimaryButton } from "../uikit/Buttons/PrimaryButton/PrimaryButton";
import { PrimaryInput } from "../uikit/Inputs/Input";
import styles from "./loginModule.module.scss";
import { useForm } from "../../hooks/useForm";
import RocketLogo from "../../assets/icons/RocketLogo.svg?react";
import LoginIcon from "../../assets/icons/Login.svg?react";

export const LoginModule = () => {
  const {
    formData,
    handleChange,
    handleSignup,
    handleLogin,
    loginErrors,
    setLoginErrors,
  } = useForm();
  const [mode, setMode] = useState<"login" | "signup">("login");

  const changeAuthMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setLoginErrors({
      username: "",
      email: "",
      password: "",
      server: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "signup") {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };

  return (
    <div className={styles["wrapper"]}>
      <section className={styles["login"]}>
        <div className={styles["login__container"]}>
          <div className={styles["login__top"]}>
            <RocketLogo className={styles["login__top-logo"]} />
            <p className={styles["login__top-title"]}>Rocket Casino</p>
            <p className={styles["login__top-subtitle"]}>Welcome Back</p>
          </div>

          <form onSubmit={handleSubmit} className={styles["login__forms"]}>
            {mode === "signup" && (
              <div>
                <p className={styles["login__input-text"]}>Username</p>
                <PrimaryInput
                  name={"username"}
                  placeholderValue={"Enter Username"}
                  type={"text"}
                  bgColor={"rgba(15, 23, 43, 1)"}
                  widthSize={"100"}
                  inputValue={formData.username}
                  handler={handleChange}
                />
                {loginErrors.username && (
                  <p className={styles["login__error"]}>
                    {loginErrors.username}
                  </p>
                )}
              </div>
            )}

            <div>
              <p className={styles["login__input-text"]}>Email</p>
              <PrimaryInput
                name={"email"}
                placeholderValue={"Enter Email"}
                type={"email"}
                bgColor={"rgba(15, 23, 43, 1)"}
                widthSize={"100"}
                inputValue={formData.email}
                handler={handleChange}
              />
              {loginErrors.email && (
                <p className={styles["login__error"]}>{loginErrors.email}</p>
              )}
            </div>

            <div>
              <p className={styles["login__input-text"]}>Password</p>
              <PrimaryInput
                name={"password"}
                placeholderValue={"Enter Password"}
                type={"password"}
                bgColor={"rgba(15, 23, 43, 1)"}
                widthSize={"100"}
                inputValue={formData.password}
                handler={handleChange}
              />
              {loginErrors.password && (
                <p className={styles["login__error"]}>{loginErrors.password}</p>
              )}
            </div>

            <PrimaryButton
              text={mode === "login" ? "Login" : "Registration"}
              widthSize={"100"}
              bgColor1={"rgba(0, 153, 102, 1)"}
              bgColor2={"rgba(21, 93, 252, 1)"}
              Icon={LoginIcon}
            />

            <p className={styles["login__reg"]} onClick={changeAuthMode}>
              {mode === "login"
                ? `Don't have an account? Register`
                : "Already have account"}
            </p>
            {loginErrors.server && (
              <p className={styles["login__error"]}>{loginErrors.server}</p>
            )}
          </form>

          <div className={styles["login__divider"]} />
          <p className={styles["login__subtext"]}>
            Your account data is stored locally in your browser
          </p>
        </div>
      </section>
    </div>
  );
};
