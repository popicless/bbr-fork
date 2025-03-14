// taken from: https://github.com/red-blox/Util/blob/main/libs/Bin/Bin.luau

import { Spawn } from "./spawn";

type CleanupItem = Instance | RBXScriptConnection | Promise<unknown> | (() => void);

export function Cleanup() {
	const cleanup: CleanupItem[] = [];

	return {
		add: (item: CleanupItem) => cleanup.push(item),
		empty: () => {
			cleanup.forEach((item) => {
				if (typeIs(item, "Instance")) {
					item.Destroy();
				} else if (typeIs(item, "RBXScriptConnection")) {
					item.Disconnect();
				} else if (typeIs(item, "function")) {
					Spawn(item);
				} else if (Promise.is(item)) {
					(item as Promise<unknown>).cancel();
				}
			});

			cleanup.clear();
		},
	};
}
