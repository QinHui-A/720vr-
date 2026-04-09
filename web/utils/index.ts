import {useStorage} from "@vueuse/core";
import * as path from "node:path";


const uuid = function () {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "" + S4() + "" + S4() + "" + S4() + "" + S4() + S4() + S4());
};

/**
 * 将图片文件转换为 Base64 Data URL
 * @param {File} file - 图片文件（例如通过 input[type=file] 获取）
 * @returns {Promise<string>} 返回 Base64 编码的 Data URL
 */
function getBase64FromFile(file) {
  return new Promise((resolve, reject) => {
    // 检查是否为文件对象
    if (!file || !(file instanceof File)) {
      return reject(new Error('参数必须是一个有效的 File 对象'));
    }

    // 可选：检查是否为图片类型
    if (!file.type.startsWith('image/')) {
      return reject(new Error('文件必须是一个图片'));
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result; // 结果包含 data:image/...;base64,开头
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(new Error('文件读取失败: ' + error));
    };

    // 开始读取文件为 Base64 数据 URL
    reader.readAsDataURL(file);
  });
}

const authToken = useStorage('authToken', null);

const login = (value: string) => {
  authToken.value = value
}
const logout = () => {
  authToken.value = null
}

const getJson = (string: string, res: any) => {
  try {
    return JSON.parse(string);
  } catch (e) {
    return res
  }
}
const SERVE_URL = import.meta.env.VITE_APP_URL
const RELEASE_IMAGE_URL = (filePath) => {
  const IMAGE_URL = import.meta.env.VITE_APP_RELEASE_IMAGE_URL;
  const match = filePath.match(/other\/(.+)$/);
  const url = match ? match[1] : path.basename(filePath);
  return IMAGE_URL + '/' + url
}
export {
  uuid,
  getBase64FromFile,
  authToken,
  login,
  logout,
  getJson,
  SERVE_URL,
  RELEASE_IMAGE_URL
}