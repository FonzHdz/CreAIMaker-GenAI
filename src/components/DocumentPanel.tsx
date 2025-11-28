import { motion } from 'motion/react';
import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'draft' | 'confirmed';
  lastUpdated?: string;
}

interface DocumentPanelProps {
  title: string;
  subtitle?: string;
  sections: DocumentSection[];
  onConfirmChanges?: () => void;
  hasPendingChanges?: boolean;
  agentColor?: string;
}

export function DocumentPanel({
  title,
  subtitle,
  sections,
  onConfirmChanges,
  hasPendingChanges = false,
  agentColor = 'bg-blue-600'
}: DocumentPanelProps) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm h-full max-h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-start gap-3">
          <FileText size={20} className="text-gray-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        
        {hasPendingChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5"
          >
            <Clock size={16} className="text-amber-600" />
            <p className="text-sm text-amber-800">Cambios pendientes</p>
          </motion.div>
        )}
      </div>

      {/* Document content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-gray-50 min-h-0">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500">El documento se irá construyendo a medida que conversas con el agente</p>
          </div>
        ) : (
          sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Status indicator */}
              <div className="absolute -left-3 top-0">
                {section.status === 'confirmed' && (
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-green-600" />
                  </div>
                )}
                {section.status === 'draft' && (
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock size={14} className="text-amber-600" />
                  </div>
                )}
                {section.status === 'pending' && (
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertCircle size={14} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className={`ml-4 p-5 rounded-lg border-2 ${
                section.status === 'confirmed' 
                  ? 'border-green-200 bg-green-50' 
                  : section.status === 'draft'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-gray-200 bg-white'
              }`}>
                <h4 className="text-gray-900 mb-3">{section.title}</h4>
                <div className="text-sm text-gray-700 space-y-2 whitespace-pre-wrap">
                  {section.content}
                </div>
                {section.lastUpdated && (
                  <p className="text-xs text-gray-500 mt-3 italic">
                    Actualizado: {section.lastUpdated}
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer with action button */}
      {onConfirmChanges && hasPendingChanges && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <Button
            onClick={onConfirmChanges}
            className={`w-full ${agentColor} text-white hover:opacity-90 transition-opacity`}
          >
            <CheckCircle2 size={18} className="mr-2" />
            Confirmar y actualizar documento
          </Button>
        </div>
      )}
    </div>
  );
}
