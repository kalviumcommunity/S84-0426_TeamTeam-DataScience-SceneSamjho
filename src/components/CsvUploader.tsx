import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import { AccidentRecord } from "@/data/sampleData";

interface CsvUploaderProps {
  onDataLoaded: (data: AccidentRecord[]) => void;
}

export default function CsvUploader({ onDataLoaded }: CsvUploaderProps) {
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>("");
  const [rowCount, setRowCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = useCallback((file: File) => {
    setStatus('parsing');
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const records: AccidentRecord[] = results.data.map((row: any, i: number) => ({
            id: row.id || `R${i + 1}`,
            date: row.date || "",
            time: row.time || "",
            hour: parseInt(row.hour || row.time?.split(":")[0] || "0"),
            latitude: parseFloat(row.latitude || row.lat || "0"),
            longitude: parseFloat(row.longitude || row.lng || row.lon || "0"),
            weather: row.weather || "Unknown",
            roadType: row.roadType || row.road_type || "Unknown",
            severity: row.severity || "Minor",
            casualties: parseInt(row.casualties || "0"),
            vehicles: parseInt(row.vehicles || "1"),
            zone: row.zone || "Unknown",
            lightCondition: row.lightCondition || row.light_condition || "Unknown",
          }));
          setRowCount(records.length);
          setStatus('success');
          onDataLoaded(records);
        } catch (e) {
          setErrorMsg("Failed to parse CSV data.");
          setStatus('error');
        }
      },
      error: () => {
        setErrorMsg("Error reading file.");
        setStatus('error');
      },
    });
  }, [onDataLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) handleFile(file);
  }, [handleFile]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div>
      <div
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('csv-input')?.click()}
      >
        <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={handleInput} />

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div key="idle" className="flex flex-col items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Upload className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drop a CSV file or click to upload</p>
              <p className="text-xs text-muted-foreground">Supports accident datasets with columns: date, time, weather, roadType, severity, etc.</p>
            </motion.div>
          )}
          {status === 'parsing' && (
            <motion.div key="parsing" className="flex flex-col items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <FileText className="w-10 h-10 text-primary" />
              </motion.div>
              <p className="text-sm text-foreground">Processing {fileName}...</p>
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div key="success" className="flex flex-col items-center gap-3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle className="w-10 h-10 text-neon-green" />
              <p className="text-sm text-foreground">{fileName} loaded successfully</p>
              <p className="text-xs text-muted-foreground">{rowCount} records parsed</p>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div key="error" className="flex flex-col items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertCircle className="w-10 h-10 text-neon-red" />
              <p className="text-sm text-neon-red">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
