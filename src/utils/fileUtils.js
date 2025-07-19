import { ref } from 'vue';

// 文件类型映射
const getFileType = (filename) => {
  const extension = filename.toLowerCase().split('.').pop();
  const typeMap = {
    'pdf': 'pdf',
    'doc': 'doc',
    'docx': 'doc',
    'ppt': 'ppt',
    'pptx': 'ppt',
    'xls': 'excel',
    'xlsx': 'excel',
    'txt': 'file',
    'md': 'file',
    'js': 'file',
    'ts': 'file',
    'vue': 'file',
    'html': 'file',
    'css': 'file',
    'json': 'file',
    'png': 'file',
    'jpg': 'file',
    'jpeg': 'file',
    'gif': 'file',
    'svg': 'file',
    'mp4': 'file',
    'mp3': 'file',
    'zip': 'file',
    'rar': 'file'
  };
  
  return typeMap[extension] || 'file';
};

// 随机生成上传人（模拟真实场景）
const getRandomUploader = () => {
  const uploaders = ['张教授', '李老师', '王助教', '赵老师', '刘教授', '陈老师', '教务处', '系统管理员'];
  return uploaders[Math.floor(Math.random() * uploaders.length)];
};

// 生成随机的修改时间（最近30天内）
const generateModifiedTime = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30); // 0-30天前
  const hoursAgo = Math.floor(Math.random() * 24); // 0-24小时前
  const minutesAgo = Math.floor(Math.random() * 60); // 0-60分钟前
  
  const modifiedTime = new Date(now);
  modifiedTime.setDate(modifiedTime.getDate() - daysAgo);
  modifiedTime.setHours(modifiedTime.getHours() - hoursAgo);
  modifiedTime.setMinutes(modifiedTime.getMinutes() - minutesAgo);
  
  return modifiedTime.toISOString();
};

// 读取TempMaterialsStorage目录的文件信息
export const loadFilesFromStorage = async () => {
  try {
    // 模拟延迟，让用户看到加载状态
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 真实文件列表（从目录中读取到的文件）
    const realFilesData = [
      {
        name: '关于开展2024年度全校优秀志愿服务个人、集体评比表彰活动的通知(2) (1).doc',
        size: 456704, // 真实文件大小 (约446KB)
        modifiedTime: '2024-01-15T09:30:00.000Z'
      },
      {
        name: '汇总表.xlsx',
        size: 10240, // 真实文件大小 (约10KB)
        modifiedTime: '2024-01-12T14:20:00.000Z'
      },
      {
        name: '推荐表.docx',
        size: 361472, // 真实文件大小 (约353KB)
        modifiedTime: '2024-01-10T16:45:00.000Z'
      }
    ];

    const files = realFilesData.map((fileData, index) => {
      const fileName = fileData.name;
      // 判断是否为文件夹（不包含扩展名的项目视为文件夹）
      const isFolder = !fileName.includes('.');
      const type = isFolder ? 'folder' : getFileType(fileName);
      
      return {
        id: index + 1,
        name: fileName,
        type: type,
        uploader: getRandomUploader(), // 保留模拟上传人
        modifiedTime: fileData.modifiedTime,
        size: isFolder ? null : fileData.size,
        path: `/TempMaterialsStorage/${fileName}` // 修改为 public 目录下的路径，可以直接通过 HTTP 访问
      };
    });

    // 按修改时间降序排列（最新的在前面）
    files.sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime));

    return files;
  } catch (error) {
    console.error('读取文件失败:', error);
    return [];
  }
};

// 实现真实的文件下载功能
export const downloadFile = async (file) => {
  try {
    console.log(`正在下载文件: ${file.name}`);
    
    if (file.type === 'folder') {
      throw new Error('无法下载文件夹');
    }

    // 尝试从服务器获取真实文件
    const response = await fetch(file.path);
    
    if (!response.ok) {
      throw new Error(`文件不存在或无法访问 (HTTP ${response.status})`);
    }

    // 获取文件内容作为 Blob
    const blob = await response.blob();
    
    // 检查是否获取到有效内容
    if (blob.size === 0) {
      throw new Error('文件内容为空');
    }
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    
    // 添加到 DOM 并点击下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`文件 ${file.name} 下载成功`);
    return true;
    
  } catch (error) {
    console.error('下载文件失败:', error);
    
    // 提供更详细的错误信息和解决方案
    const errorMessage = `❌ 下载失败：${error.message}

📁 文件位置问题解决方案：

方案1（推荐）：将文件移动到 public 目录
1. 复制 src/TempMaterialsStorage/ 目录下的所有文件
2. 粘贴到 public/TempMaterialsStorage/ 目录中
3. 刷新页面后即可正常下载

方案2：使用演示下载（当前可用）
点击"确定"将下载一个包含文件信息的演示文件

当前文件路径: ${file.path}`;
    
    const useDemo = confirm(errorMessage);
    
    if (useDemo) {
      // 提供演示下载功能
      return downloadDemoFile(file);
    }
    
    throw error;
  }
};

// 演示下载功能（生成包含文件信息的文本文件）
const downloadDemoFile = (file) => {
  try {
    const demoContent = `文件信息演示下载
========================

原始文件名: ${file.name}
文件类型: ${file.type}
文件大小: ${formatFileSize(file.size)}
上传人: ${file.uploader}
修改时间: ${new Date(file.modifiedTime).toLocaleString('zh-CN')}
文件路径: ${file.path}

说明：
这是一个演示下载文件，包含了原始文件的基本信息。
要下载真实的 Office 文档，请按照以下步骤操作：

1. 将 src/TempMaterialsStorage/ 目录中的文件
2. 复制到 public/TempMaterialsStorage/ 目录中
3. 刷新页面后重新尝试下载

生成时间: ${new Date().toLocaleString('zh-CN')}`;

    const blob = new Blob([demoContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `[演示]${file.name.replace(/\.[^/.]+$/, '')}_文件信息.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`演示文件下载成功: ${file.name}`);
    return true;
    
  } catch (error) {
    console.error('演示下载也失败了:', error);
    throw error;
  }
};

// 工具函数：格式化文件大小（添加到这里以便 downloadDemoFile 使用）
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// 获取文件MIME类型
const getFileMimeType = (fileType) => {
  const mimeTypes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'file': 'application/octet-stream'
  };
  return mimeTypes[fileType] || 'application/octet-stream';
};

// 生成模拟文件内容（用于演示下载功能）
const generateFileContent = (file) => {
  switch (file.type) {
    case 'pdf':
      return `这是 ${file.name} 的模拟内容\n\n创建时间: ${new Date().toLocaleString()}\n文件大小: ${file.size} bytes\n上传人: ${file.uploader}`;
    case 'doc':
      return `${file.name}\n\n这是一个Word文档的模拟内容。\n\n文档信息:\n- 创建者: ${file.uploader}\n- 修改时间: ${file.modifiedTime}\n- 文件大小: ${file.size} bytes`;
    case 'ppt':
      return `${file.name}\n\nPowerPoint演示文稿内容\n\n幻灯片1: 标题页\n幻灯片2: 内容介绍\n幻灯片3: 总结\n\n创建者: ${file.uploader}`;
    default:
      return `${file.name}\n\n文件内容模拟\n创建时间: ${new Date().toLocaleString()}\n文件路径: ${file.path}`;
  }
};

// 在真实项目中的实现示例（需要后端支持）
export const loadRealFilesFromStorage = async () => {
  try {
    // 方案1: 调用后端API
    const response = await fetch('/api/files/list?directory=TempMaterialsStorage');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const filesData = await response.json();
    return filesData;
    
    // 方案2: 如果使用Electron等桌面应用框架
    // const fs = require('fs').promises;
    // const path = require('path');
    // const storagePath = './TempMaterialsStorage';
    // const files = await fs.readdir(storagePath);
    // return files.map(async (fileName) => {
    //   const filePath = path.join(storagePath, fileName);
    //   const stats = await fs.stat(filePath);
    //   return {
    //     id: fileName,
    //     name: fileName,
    //     type: stats.isDirectory() ? 'folder' : getFileType(fileName),
    //     uploader: '系统', // 可以从文件元数据或数据库获取
    //     modifiedTime: stats.mtime.toISOString(),
    //     size: stats.isDirectory() ? null : stats.size,
    //     path: filePath
    //   };
    // });
  } catch (error) {
    console.error('读取真实文件失败:', error);
    return [];
  }
};

// 真实项目中的下载实现
export const downloadRealFile = async (file) => {
  try {
    // 方案1: 通过后端API下载
    const response = await fetch(`/api/files/download?path=${encodeURIComponent(file.path)}`);
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('下载真实文件失败:', error);
    throw error;
  }
};

// 监听文件系统变化的功能（可选）
export const useFileWatcher = () => {
  const files = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const refreshFiles = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      files.value = await loadFilesFromStorage();
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  // 初始加载
  refreshFiles();

  return {
    files,
    isLoading,
    error,
    refreshFiles
  };
}; 