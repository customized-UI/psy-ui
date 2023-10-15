/**
 * <p> 获取加载图片地址 </p>
 * examples: /src/assets/bg/bg.png
 * @param url: string
 *
 */
const useFile = (url: string) => {
  const modules: Record<string, any> = import.meta.glob("@/assets/images/**/*.{png,svg,jpg,jpeg,gif}", { eager: true });
    if (modules[url]) return modules[url].default;
    else {
      // 地址错误
      console.log("Error url is wrong path");
    }
};
  
export default useFile;