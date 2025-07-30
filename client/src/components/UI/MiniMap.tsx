export function MiniMap() {
  return (
    <div className="fixed bottom-4 right-4 w-32 h-32 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2 z-30">
      <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
        <span className="text-xs text-gray-500">Mini Map</span>
      </div>
    </div>
  )
}