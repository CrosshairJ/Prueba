import { useEffect, useMemo, useState } from "react";
import { Bus } from "../models";
import { BusService } from "../services";

export function usePassengerViewModel() {
  const [search, setSearch] = useState("");
  const [allBuses, setAllBuses] = useState<Bus[]>(() => BusService.getBuses());

  useEffect(() => {
    return BusService.subscribe(setAllBuses);
  }, []);

  const buses = useMemo(() => {
    const query = search.toLowerCase();
    return allBuses.filter((b) => `${b.id} ${b.line} ${b.destination}`.toLowerCase().includes(query));
  }, [search, allBuses]);

  return { search, setSearch, buses, resultCount: buses.length };
}