/**
 * 安全路径验证工具
 * 防止路径遍历攻击 (CWE-22)
 *
 * @module path-validator
 */
import path from "node:path";

/**
 * 验证用户提供的路径是否在允许的根目录内
 *
 * @param {string} root - 允许的根目录（绝对路径）
 * @param {string} userPath - 用户提供的路径（相对或绝对）
 * @param {Object} options - 选项
 * @param {boolean} options.allowAbsolute - 是否允许绝对路径（默认 false）
 * @returns {string} 验证后的绝对路径
 * @throws {Error} 如果路径越界或包含恶意模式
 *
 * @example
 * // 安全的相对路径
 * validatePath("/workspace", "templates/file.xlsx")
 * // => "/workspace/templates/file.xlsx"
 *
 * @example
 * // 阻止路径遍历
 * validatePath("/workspace", "../../../etc/passwd")
 * // => 抛出错误: "路径越界: ../../../etc/passwd"
 *
 * @example
 * // 阻止绝对路径
 * validatePath("/workspace", "/etc/passwd")
 * // => 抛出错误: "不允许使用绝对路径: /etc/passwd"
 */
export function validatePath(root, userPath, options = {}) {
    // 1. 输入验证
    if (typeof userPath !== "string" || !userPath.trim()) {
        throw new Error("路径不能为空");
    }

    // 2. 检查恶意字符（空字节注入）
    if (userPath.includes("\0")) {
        throw new Error(`路径包含非法字符: ${userPath}`);
    }

    // 3. 绝对路径处理
    if (path.isAbsolute(userPath)) {
        if (!options.allowAbsolute) {
            throw new Error(`不允许使用绝对路径: ${userPath}`);
        }
        // 即使允许绝对路径，也必须在根目录内
        const relative = path.relative(root, userPath);
        if (relative.startsWith("..") || path.isAbsolute(relative)) {
            throw new Error(`绝对路径越界: ${userPath}`);
        }
        return userPath;
    }

    // 4. 解析相对路径
    const resolved = path.resolve(root, userPath);

    // 5. 边界检查：确保解析后的路径仍在根目录内
    const relative = path.relative(root, resolved);

    // 检查是否包含 ".." 或变成绝对路径（说明逃出了根目录）
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error(`路径越界: ${userPath}`);
    }

    return resolved;
}

/**
 * 批量验证多个路径
 *
 * @param {string} root - 允许的根目录
 * @param {string[]} paths - 用户提供的路径数组
 * @param {Object} options - 验证选项
 * @returns {string[]} 验证后的绝对路径数组
 * @throws {Error} 如果任何路径无效
 */
export function validatePaths(root, paths, options = {}) {
    return paths.map((p) => validatePath(root, p, options));
}

/**
 * 检查路径是否在根目录内（不抛出错误）
 *
 * @param {string} root - 允许的根目录
 * @param {string} userPath - 用户提供的路径
 * @returns {boolean} 如果路径安全返回 true
 */
export function isPathSafe(root, userPath) {
    try {
        validatePath(root, userPath);
        return true;
    } catch {
        return false;
    }
}
