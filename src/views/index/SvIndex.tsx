import FeaturedBoards from "./modules/FeaturedBoards.tsx";
import MealNotice from "./modules/MealNotice.tsx";
import TimeTable from "./modules/TimeTable.tsx";
import StudentCard from "./modules/StudentCard.tsx";

function SvIndex() {
  return (
    <div className={'w-full lg:w-3/4 mx-auto mb-3 px-5 flex flex-col md:grid md:grid-cols-3 gap-5'}>
      <StudentCard/>
      <FeaturedBoards/>
      <TimeTable/>
      <MealNotice/>
    </div>
  );
}

export default SvIndex;
