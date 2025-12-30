import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // 这里可以添加错误报告服务
    // reportError(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            
            <h2 className="text-xl font-semibold text-white text-center mb-2">
              出现了一些问题
            </h2>
            
            <p className="text-gray-400 text-center mb-6">
              应用程序遇到了一个意外错误。请尝试重新加载页面。
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 p-4 bg-gray-900 rounded border border-gray-600">
                <summary className="text-sm font-medium text-gray-300 cursor-pointer">
                  错误详情 (开发模式)
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
export default ErrorBoundary