import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { WorkOrdersTable } from '../components/WorkOrdersTable';
import { WorkshopChatModal } from '../components/WorkshopChatModal';
import { WorkshopNewClaimWizard } from '../components/WorkshopNewClaimWizard';
import { mockWorkOrders } from '../data/mockWorkOrders';

type TabValue = 'new-claim' | 'work-orders';

export function WorkshopWorkOrdersPage() {
  const [tab, setTab] = useState<TabValue>('work-orders');
  const [chatWorkOrder, setChatWorkOrder] = useState<string | null>(null);

  const chatCarrier =
    chatWorkOrder
      ? mockWorkOrders.find((wo) => wo.workOrderNo === chatWorkOrder)?.carrier
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Tabs<TabValue> value={tab} onValueChange={setTab}>
        <TabsList className="max-w-md">
          <TabsTrigger value="new-claim">New Claim</TabsTrigger>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="new-claim">
            <WorkshopNewClaimWizard onCancel={() => setTab('work-orders')} />
          </TabsContent>
          <TabsContent value="work-orders">
            <WorkOrdersTable onOpenChat={setChatWorkOrder} />
          </TabsContent>
        </div>
      </Tabs>

      <WorkshopChatModal
        isOpen={chatWorkOrder !== null}
        onClose={() => setChatWorkOrder(null)}
        workOrderNo={chatWorkOrder}
        carrier={chatCarrier ?? null}
      />
    </div>
  );
}
