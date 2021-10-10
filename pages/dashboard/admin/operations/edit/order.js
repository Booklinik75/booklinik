import DashboardUi from "../../../../../components/DashboardUi";
import {
  checkAdmin,
  getOperationCategories,
} from "../../../../../utils/ServerHelpers";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect, useRef } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import firebase from "../../../../../firebase/clientApp";

export const getServerSideProps = async (ctx) => {
  // check admin
  const auth = await checkAdmin(ctx);
  if (auth.redirect) {
    return auth;
  }

  // get surgery categories
  const categories = await getOperationCategories();
  const categoriesOrder = categories.map((category) => {
    return { [category.id.toString()]: category.name };
  });

  return {
    props: { categoriesOrder, auth },
  };
};

const OrderSurgeryCategories = ({ auth, categoriesOrder }) => {
  const [newCategories, setNewCategories] = useState(categoriesOrder);
  const [saving, setSaving] = useState(false);

  function handleOnDragEnd(e) {
    const items = Array.from(newCategories);
    const [reorderedItem] = items.splice(e.source.index, 1);
    items.splice(e.destination.index, 0, reorderedItem);

    setNewCategories(items);
  }

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setSaving(true);

    async function doUpdate() {
      await firebase
        .firestore()
        .collection("settings")
        .doc("surgeryCategoriesOrdering")
        .set({ ...[newCategories] })
        .then(() => {
          setTimeout(() => {
            setSaving(false);
          }, 2000);
        });
    }

    doUpdate();

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCategories]);

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-10 space-y-4">
        <h1 className="text-4xl gap-4 flex items-baseline">
          Ordering : Catégories d&apos;opérations
          {saving === true ? (
            <span className="text-base text-shamrock animate-pulse flex items-center gap-2">
              <span className="animate-spin">
                <AiOutlineLoading />
              </span>{" "}
              Sauvegarde ...
            </span>
          ) : (
            ""
          )}
        </h1>
        <p className="text-gray-400">
          Réorganisez l&apos;ordre des catégories d&apos;opérations en utilisant
          le drag and drop.
        </p>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                className="w-full space-y-4 categories"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {newCategories.map((el, index) => {
                  return (
                    <Draggable
                      key={Object.values(el)[0].toString()}
                      draggableId={Object.keys(el)[0].toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p className="rounded items-center bg-gray-50 shadow p-2 flex gap-2 w-full md:w-2/3 lg:w-3/6 xl:w-2/6">
                            <span className="py-2 px-4 rounded-full bg-shamrock text-lg text-white">
                              {index}
                            </span>
                            <span>{Object.values(el)[0]}</span>
                          </p>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </DashboardUi>
  );
};

export default OrderSurgeryCategories;
