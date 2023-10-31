import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import CompareOutlinedIcon from "@mui/icons-material/CompareOutlined";
import Box from "@mui/material/Box";

import { useAtom } from "jotai";
import { ClipboardCopy } from "@/components/ClipboardCopy";

import { resultAtom, showDiffAtom } from "@/app/atoms";
import { Header } from "./Header";
import { UsedInstructionsPlaceholder } from "./InstructionsToolbar";
import { HotkeyHint } from "./HotkeyHint";

export function RefinedArea() {
  const [showDiff, setShowDiff] = useAtom(showDiffAtom);
  const [result] = useAtom(resultAtom);

  return (
    <Stack spacing={2} direction="column" flexGrow={1}>
      <Header></Header>
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          textAlign: "left",
          flexGrow: 1,
        }}
      >
        <UsedInstructionsPlaceholder />
        {result}
      </Box>
      <Stack spacing={2} direction="row">
        {result.length > 0 && (
          <>
            <ClipboardCopy />
            <ToggleButton
              size="small"
              value="check"
              selected={showDiff}
              onChange={() => setShowDiff(!showDiff)}
            >
              <CompareOutlinedIcon />
              {showDiff ? "Hide" : "Show"} diff
              <HotkeyHint hotkey="mod+shift+d" />
            </ToggleButton>
          </>
        )}
      </Stack>
    </Stack>
  );
}
