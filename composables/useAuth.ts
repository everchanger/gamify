export default () => {
  if (!process.client) {
    return { promise: undefined, getUserData: undefined };
  }

  const token = useState("token");
  const user = useState("user");
  const router = useRouter();
  const logout = useLogout();

  const promise = useState("tokenPromise");
  const hasStartupAuthRan = useState("hasStartupAuthRan");

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { token: signedInToken } = await $fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      token.value = `Bearer ${signedInToken}`;
      localStorage.setItem("token", token.value);

      getUserData();
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = () => {
    promise.value = $fetch("/api/user", {
      method: "GET",
      headers: {
        Authorization: token.value,
      },
    });

    promise.value
      .then((response: any) => {
        user.value = JSON.parse(response);
        router.push("/app");
      })
      .catch((error: any) => {
        console.log("error while signing in", error);
        logout();
      });
  };

  // Check if token is in local storage, if it extists, get user data
  token.value = localStorage.getItem("token");
  if (token.value && !hasStartupAuthRan.value) {
    hasStartupAuthRan.value = true;
    getUserData();
  }

  return { promise: promise.value, login };
};
