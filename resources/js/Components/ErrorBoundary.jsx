import React, { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[hsla(40,30%,99%,1)] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-[#E0E6ED] text-center space-y-6">
            <div className="w-16 h-16 bg-[#FDEAEA] text-[#D64545] rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#1A3A5C]">Oups ! Quelque chose s'est mal passé.</h1>
              <p className="text-[hsla(210,20%,40%,1)] font-medium leading-relaxed">
                Une erreur inattendue est survenue dans l'application. Nos équipes ont été informées.
              </p>
            </div>

            {import.meta.env.DEV && (
              <div className="p-4 bg-[hsla(210,25%,98%,1)] rounded-xl border border-[#E0E6ED] text-left overflow-auto max-h-40">
                <p className="text-xs font-bold text-[#1A3A5C] uppercase tracking-widest mb-2">Détails de l'erreur :</p>
                <code className="text-xs text-[#D64545] break-all">
                  {this.state.error?.toString()}
                </code>
              </div>
            )}

            <Button
              onClick={this.handleReset}
              className="w-full h-12 gap-2"
            >
              <RefreshCw size={18} />
              Actualiser la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
