import DashboardUi from "../../../../components/DashboardUi";
import {
  checkAdmin,
  getOperationCategories,
  getBackEndAsset,
} from "../../../../utils/ServerHelpers";
import Image from "next/image";
import Link from "next/link";
import { BsChevronRight } from "react-icons/bs";

export const getServerSideProps = async (ctx) => {
  const userProfile = await checkAdmin(ctx);
  const operationCategories = await getOperationCategories();

  const operationsImageT = await Promise.all(
    operationCategories.map(async (operationCategory, index, array) => {
      let image = await getBackEndAsset(operationCategory.photo);
      operationCategories[index].photo = image;
    })
  );

  return {
    props: { userProfile, operationCategories },
  };
};

const OperationsList = ({ operationCategories }) => {
  return (
    <DashboardUi isAdmin={true}>
      <div className="col-span-10 space-y-3">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl mb-4">Opérations</h1>
          <Link href="operations/add/" passHref={true}>
            <button className="px-6 py-3 bg-shamrock text-white transition border rounded border-shamrock hover:bg-white hover:text-shamrock">
              Ajouter
            </button>
          </Link>
        </div>
        {operationCategories.length !== 0 ? (
          operationCategories.map((operationCategory) => {
            return (
              <div key={operationCategory.slug}>
                <Link
                  href={`/dashboard/admin/operations/edit/${operationCategory.slug}`}
                >
                  <a className="flex space-x-4 items-center transition hover:bg-gray-100 hover:cursor-pointer group">
                    <Image
                      src={operationCategory.photo}
                      width="200"
                      height={100}
                      objectFit="cover"
                      alt={operationCategory.name}
                    />
                    <div className="flex w-full items-center justify-between p-3">
                      <div>
                        <p>{operationCategory.name}</p>
                        <p className="font-mono text-xs uppercase text-gray-500  ">
                          {operationCategory.slug}
                        </p>
                      </div>
                      <div>
                        <p className="items-center text-shamrock hidden group-hover:flex">
                          Modifier <BsChevronRight size={14} />
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            );
          })
        ) : (
          <div>
            <p>Aucune catégorie d&apos;opération trouvée.</p>
          </div>
        )}
      </div>
    </DashboardUi>
  );
};

export default OperationsList;
