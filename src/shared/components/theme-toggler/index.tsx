import { useTheme } from "next-themes";
import { BsFillMoonFill, BsSun } from "react-icons/bs";

const ThemeToggler = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <>
      {resolvedTheme === "winter" ? (
        <BsFillMoonFill
          onClick={() => {
            resolvedTheme === "winter" ? setTheme("dark") : setTheme("winter");
          }}
          className="hover:text-primary cursor-pointer duration-300 h-5 mb-1 w-5"
        ></BsFillMoonFill>
      ) : (
        <BsSun
          onClick={() => {
            resolvedTheme === "winter" ? setTheme("dark") : setTheme("winter");
          }}
          className="text-lg hover:text-amber-400 cursor-pointer duration-300 h-5 w-5"
        ></BsSun>
      )}
    </>
  );
};

export default ThemeToggler;
