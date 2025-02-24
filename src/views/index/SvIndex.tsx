import FeaturedBoards from "./modules/FeaturedBoards.tsx";
import MealNotice from "./modules/MealNotice.tsx";
import TimeTable from "./modules/TimeTable.tsx";

function SvIndex() {
  return (
    <div className={'w-full lg:w-3/4 mx-auto px-5 flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-5'}>
      <FeaturedBoards/>
      <MealNotice/>
      <p></p>
      <TimeTable/>
    </div>
  );
}

export default SvIndex;
