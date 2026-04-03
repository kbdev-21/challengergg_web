import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchItemsData, updateItemType} from "../services/challengerggApi.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import {useState} from "react";
import {X} from "lucide-react";

const ITEM_TYPES = ["START", "BASE", "BOOT", "UTILITY", "LEGENDARY", "OTHER", "EMPTY"];

export default function ItemManagerPage() {
  const {
    data: items,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['items'],
    queryFn: () => fetchItemsData()
  });

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return <LoadingSpinner/>;
  if (isError) return <ErrorAlert/>;

  const grouped = ITEM_TYPES.reduce((acc, type) => {
    acc[type] = items.filter(item => item.type === type).sort((a, b) => a.gold - b.gold);
    return acc;
  }, {});

  function toggleItem(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selectedItems = items.filter(item => selectedIds.has(item.id));

  return (
    <div className={"flex flex-col gap-6"}>
      {selectedIds.size > 0 && (
        <div className={"flex items-center justify-between bg-bg2 border border-bg3 rounded-md px-4 py-2"}>
          <div className={"text-sm text-text2"}>{selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected</div>
          <div className={"flex gap-2"}>
            <button
              onClick={() => setSelectedIds(new Set())}
              className={"cursor-pointer text-xs text-text2 hover:text-text1 px-3 py-1.5 rounded-md border border-bg3"}
            >
              Clear
            </button>
            <button
              onClick={() => setIsDialogOpen(true)}
              className={"cursor-pointer text-xs bg-main text-black font-[500] px-3 py-1.5 rounded-md hover:opacity-90"}
            >
              Update type
            </button>
          </div>
        </div>
      )}

      {ITEM_TYPES.map(type => (
        <div key={type}>
          <div className={"mb-2 font-[600] text-sm text-text2"}>{type}</div>
          <div className={"flex flex-wrap gap-2"}>
            {grouped[type].map(item => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div key={item.id} className={"relative"} onClick={() => toggleItem(item.id)}>
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className={`w-10 h-10 rounded-md border-2 cursor-pointer transition-colors ${isSelected ? "border-main" : "border-bg3 hover:border-main/50"}`}
                    data-tooltip-id={"item-tooltip"}
                    data-tooltip-html={`<div style="font-size:12px"><strong>${item.name}</strong><br/><span style="opacity:0.7">${item.shortDescription}</span><br/><span style="color:#c89b3c">${item.gold}g</span></div>`}
                  />
                  {isSelected && (
                    <div className={"absolute -top-1 -right-1 w-3 h-3 rounded-full bg-main pointer-events-none"}/>
                  )}
                </div>
              );
            })}
            {grouped[type].length === 0 && (
              <div className={"text-xs text-text3 italic"}>No items</div>
            )}
          </div>
        </div>
      ))}

      {isDialogOpen && (
        <UpdateItemTypeDialog
          items={selectedItems}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedIds(new Set());
          }}
        />
      )}
    </div>
  );
}

function UpdateItemTypeDialog({items, onClose}) {
  const [selectedType, setSelectedType] = useState(items[0]?.type ?? "OTHER");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    await Promise.all(items.map(item => updateItemType(item.id, selectedType)));
    await queryClient.invalidateQueries({queryKey: ['items']});
    setIsLoading(false);
    onClose();
  }

  return (
    <div
      className={"fixed inset-0 z-50 flex items-center justify-center bg-black/50"}
      onClick={onClose}
    >
      <div
        className={"bg-bg2 border border-bg3 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={"flex items-center justify-between"}>
          <div className={"font-[600] text-base"}>Update item type</div>
          <X size={18} className={"cursor-pointer text-text2 hover:text-text1"} onClick={onClose}/>
        </div>
        <div className={"flex flex-wrap gap-1.5 max-h-32 overflow-y-auto"}>
          {items.map(item => (
            <img key={item.id} src={item.imgUrl} alt={item.name} className={"w-8 h-8 rounded-md border border-bg3"} title={item.name}/>
          ))}
        </div>
        <div className={"text-xs text-text2"}>{items.length} item{items.length > 1 ? "s" : ""} will be updated</div>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-3"}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={"w-full bg-bg1 border border-bg3 rounded-md px-3 py-2 text-sm focus:outline-none"}
          >
            {ITEM_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            type={"submit"}
            disabled={isLoading}
            className={"cursor-pointer bg-main text-black text-sm font-[500] px-4 py-1.5 rounded-md hover:opacity-90 self-end disabled:opacity-50"}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
