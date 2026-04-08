import { motion } from "framer-motion";
import PredictionForm from "@/components/PredictionForm";
import RecommendationCards from "@/components/RecommendationCards";
import { sampleAccidents, generateRecommendations } from "@/data/sampleData";

export default function PredictionsPage() {
  const recommendations = generateRecommendations(sampleAccidents);

  return (
    <div className="space-y-8">
      <div>
        <motion.h2 className="font-display text-2xl font-bold gradient-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Predictive Analysis
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1">Estimate accident risk and get AI-powered recommendations</p>
      </div>

      <PredictionForm />

      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">💡 AI Recommendations</h3>
        <RecommendationCards recommendations={recommendations} />
      </div>
    </div>
  );
}
