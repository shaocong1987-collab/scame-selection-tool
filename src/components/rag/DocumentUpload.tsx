import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, FolderOpen, Database } from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  chunks?: number;
}

interface DocumentUploadProps {
  onUploadComplete?: (documents: UploadedDocument[]) => void;
  maxFileSize?: number; // MB
  allowedFileTypes?: string[];
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadComplete,
  maxFileSize = 50, // 50MB
  allowedFileTypes = ['.pdf', '.docx', '.pptx', '.xlsx', '.md', '.txt', '.csv', '.json'],
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const newDocuments: UploadedDocument[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type || getFileExtension(file.name),
      status: 'pending',
      progress: 0,
    }));

    setUploadedDocuments(prev => [...prev, ...newDocuments]);
    await processDocuments(newDocuments);
  }, []);

  const getFileExtension = (filename: string): string => {
    return '.' + filename.split('.').pop()?.toLowerCase() || '';
  };


  const processDocuments = async (documents: UploadedDocument[]) => {
    setIsProcessing(true);
    setTotalProgress(0);

    const totalDocs = documents.length;
    let processedCount = 0;

    for (const doc of documents) {
      try {
        // 更新状态为处理中
        setUploadedDocuments(prev => prev.map(d =>
          d.id === doc.id ? { ...d, status: 'processing', progress: 10 } : d
        ));

        // 模拟处理过程
        await simulateProcessing(doc);

        // 更新状态为完成
        setUploadedDocuments(prev => prev.map(d =>
          d.id === doc.id ? { ...d, status: 'completed', progress: 100, chunks: Math.floor(Math.random() * 50) + 10 } : d
        ));

        processedCount++;
        setTotalProgress(Math.round((processedCount / totalDocs) * 100));

      } catch (error) {
        // 更新状态为错误
        setUploadedDocuments(prev => prev.map(d =>
          d.id === doc.id ? {
            ...d,
            status: 'error',
            error: error instanceof Error ? error.message : '处理失败',
            progress: 0
          } : d
        ));
      }
    }

    setIsProcessing(false);
    onUploadComplete?.(uploadedDocuments);
  };

  const simulateProcessing = async (doc: UploadedDocument): Promise<void> => {
    // 模拟处理步骤
    const steps = [
      { progress: 20, message: '验证文件格式' },
      { progress: 40, message: '提取文本内容' },
      { progress: 60, message: '分析文档结构' },
      { progress: 80, message: '生成文档块' },
      { progress: 100, message: '添加到知识库' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 500));

      setUploadedDocuments(prev => prev.map(d =>
        d.id === doc.id ? { ...d, progress: step.progress } : d
      ));
    }
  };

  const removeDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const retryDocument = async (id: string) => {
    const doc = uploadedDocuments.find(d => d.id === id);
    if (doc) {
      await processDocuments([doc]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'processing': return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'error': return <AlertCircle className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-scame-blue bg-blue-50'
            : 'border-gray-300 hover:border-scame-blue hover:bg-gray-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center justify-center p-4 bg-scame-blue/10 rounded-full mb-4">
            <Upload className="h-8 w-8 text-scame-blue" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            上传SCAME技术文档
          </h3>

          <p className="text-gray-600 mb-6">
            将PDF、DOCX、PPTX等文档拖放到此区域，或点击选择文件
          </p>

          <div className="space-y-3">
            <label className="block">
              <input
                type="file"
                multiple
                accept={allowedFileTypes.join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="px-6 py-3 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                选择文件
              </div>
            </label>

            <div className="text-sm text-gray-500">
              支持 {allowedFileTypes.join(', ')} 格式，单个文件最大 {maxFileSize}MB
            </div>
          </div>
        </div>
      </div>

      {/* 处理进度 */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin mr-2" />
              <span className="font-medium text-blue-900">正在处理文档</span>
            </div>
            <span className="text-blue-700 font-medium">{totalProgress}%</span>
          </div>

          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-scame-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>

          <div className="mt-2 text-sm text-blue-700">
            已将知识添加到SCAME智能知识库
          </div>
        </div>
      )}

      {/* 上传的文件列表 */}
      {uploadedDocuments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">已上传文档</h4>
            <span className="text-sm text-gray-500">
              {uploadedDocuments.filter(d => d.status === 'completed').length}/{uploadedDocuments.length} 个已完成
            </span>
          </div>

          <div className="space-y-3">
            {uploadedDocuments.map(doc => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="font-medium text-gray-900 truncate">{doc.name}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {formatFileSize(doc.size)} • {doc.type}
                        </div>
                      </div>
                    </div>

                    {/* 进度条 */}
                    {doc.status === 'processing' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">处理中...</span>
                          <span className="font-medium text-blue-600">{doc.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-scame-blue h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${doc.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 错误信息 */}
                    {doc.status === 'error' && doc.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-red-700">{doc.error}</div>
                        </div>
                        <button
                          onClick={() => retryDocument(doc.id)}
                          className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          重试
                        </button>
                      </div>
                    )}

                    {/* 完成信息 */}
                    {doc.status === 'completed' && doc.chunks && (
                      <div className="mt-3 flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>已添加到知识库</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Database className="h-4 w-4 mr-1" />
                          <span>{doc.chunks} 个知识块</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={doc.status === 'processing'}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <FolderOpen className="h-5 w-5 text-gray-500 mr-2" />
          文档处理说明
        </h4>

        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            上传的文档将自动转换为文本并分割为知识块
          </li>
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            系统会提取文档中的技术参数、产品规格和应用案例
          </li>
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            处理完成后，文档内容将可用于智能检索和选型辅助
          </li>
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            建议上传：产品手册、技术规范、培训资料、应用案例
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUpload;