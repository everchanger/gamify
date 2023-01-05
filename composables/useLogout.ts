export default () => {
  const token = useState("token");
  const user = useState("user");
  const router = useRouter();

  return async () => {
    // await $fetch("/api/user", {
    //   method: "delete",
    // });
    token.value = "";
    user.value = "";
    localStorage.removeItem("token");
    router.push("/");
  };
};
