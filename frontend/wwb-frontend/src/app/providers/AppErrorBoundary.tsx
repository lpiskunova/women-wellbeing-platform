import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

export class AppErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in AppErrorBoundary', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div className="container">
            <Card>
              <CardHeader>
                <CardTitle>Something went wrong</CardTitle>
                <CardDescription>
                  The page failed to render. Please try again or go back to the previous screen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p style={{ marginBottom: 16, fontSize: 14 }}>{this.state.error?.message}</p>
                <Button onClick={this.handleReload}>Try again</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
