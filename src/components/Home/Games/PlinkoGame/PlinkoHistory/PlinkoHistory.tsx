import styles from "./plinko-history.module.scss";
import { useCallback, useEffect, useState } from "react";
import { PlinkoHistoryItem } from "./PlinkoHistoryItem/PlinkoHistoryItem";
import type { PlinkoHistoryItemType } from "../../../../../types/Types";



const PLINKO_HISTORY_STORAGE_KEY = "plinko_history";
const PLINKO_HISTORY_UPDATED_EVENT = "plinko_history_updated";

const readHistory = (): PlinkoHistoryItemType[] => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return [];

    try {
        const raw = localStorage.getItem(PLINKO_HISTORY_STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as unknown) : [];
        return Array.isArray(parsed) ? (parsed as PlinkoHistoryItemType[]) : [];
    } catch {
        return [];
    }
};

export const PlinkoHistory = () => {
    const [history, setHistory] = useState<PlinkoHistoryItemType[]>(() => readHistory());

    const load = useCallback(() => {
        setHistory(readHistory());
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handler = () => load();
        window.addEventListener(PLINKO_HISTORY_UPDATED_EVENT, handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener(PLINKO_HISTORY_UPDATED_EVENT, handler);
            window.removeEventListener("storage", handler);
        };
    }, [load]);

    return (
        <div className={styles["plinko-history"]}>
            <p className={styles["plinko-history__title"]}>Games History</p>

            <ul className={styles["plinko-history__list"]}>
                {history.map((game) => {
                    const totalPayout = (game.results ?? []).reduce(
                        (sum, r) => sum + (Number(r?.payout) || 0),
                        0,
                    );

                    const timeLabel = (() => {
                        const d = new Date(game.timestamp);
                        return Number.isNaN(d.getTime())
                            ? game.timestamp
                            : d.toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                              });
                    })();

                    return (
                        <PlinkoHistoryItem
                            key={game.id}
                            risk={game.risk}
                            lines={game.lines}
                            balls={game.balls}
                            totalPayout={totalPayout}
                            timeLabel={timeLabel}
                        />
                    );
                })}
            </ul>
        </div>
    );
}
