import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { WidgetSetting } from '@/types'
import useAppStore from '@/stores/useAppStore'

export default function WidgetRenderer() {
  const [widgets, setWidgets] = useState<WidgetSetting[]>([])
  const { user } = useAppStore()

  const loadWidgets = async () => {
    if (!user) return
    try {
      const records = await pb.collection('widget_settings').getFullList<WidgetSetting>({
        filter: 'is_active = true',
      })
      setWidgets(records)
    } catch (err) {
      console.error('Failed to load widgets', err)
    }
  }

  useEffect(() => {
    loadWidgets()
  }, [user])

  useRealtime('widget_settings', loadWidgets, !!user)

  if (!user || widgets.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 pointer-events-none flex flex-col items-end gap-2 p-4">
      {widgets.map((widget) => (
        <div key={widget.id} className="pointer-events-auto">
          <react-widget-uv agent_id={widget.agent_id} schema={widget.schema} type={widget.type} />
        </div>
      ))}
    </div>
  )
}
