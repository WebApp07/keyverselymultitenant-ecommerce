import configPromise from "@payload-config";
import { getPayload } from "payload";

import { Footer } from "./footer";
import Navbar from "./navbar";
import { SearchFilters } from "./search-filters";
import { Category } from "@/payload-types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "categories",
    depth: 1, // populate subcategories, subcategories[0] will be a type of "Category"
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Becasue of "depth 1' We are confident "doc" will be a type of "category""
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  console.log("data", data);

  console.log("formattedData", formattedData);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
