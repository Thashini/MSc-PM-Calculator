import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, RotateCcw, GraduationCap, BookOpen, Award } from 'lucide-react';

interface Module {
  code: string;
  name: string;
  credits: number;
  hasPresentation: boolean;
  presentationWeight: number;
  writtenWeight: number;
  hasPortfolio: boolean;
  portfolioWeight: number;
}

interface ModuleResult {
  code: string;
  presentationMark: number | '';
  writtenMark: number | '';
  portfolioMark: number | '';
  overallMark: number;
}

const modules: Module[] = [
  {
    code: 'MPM7001',
    name: 'Project Management Theory and Practice',
    credits: 20,
    hasPresentation: true,
    presentationWeight: 30,
    writtenWeight: 70,
    hasPortfolio: false,
    portfolioWeight: 0,
  },
  {
    code: 'MPM7002',
    name: 'Project Leadership',
    credits: 20,
    hasPresentation: true,
    presentationWeight: 30,
    writtenWeight: 70,
    hasPortfolio: false,
    portfolioWeight: 0,
  },
  {
    code: 'MPM7003',
    name: 'Strategic Project Management',
    credits: 20,
    hasPresentation: true,
    presentationWeight: 30,
    writtenWeight: 70,
    hasPortfolio: false,
    portfolioWeight: 0,
  },
  {
    code: 'MPM7004',
    name: 'Project Risk Management',
    credits: 20,
    hasPresentation: true,
    presentationWeight: 30,
    writtenWeight: 70,
    hasPortfolio: false,
    portfolioWeight: 0,
  },
  {
    code: 'MPM7005',
    name: 'Project Commercial Management',
    credits: 20,
    hasPresentation: false,
    presentationWeight: 0,
    writtenWeight: 100,
    hasPortfolio: false,
    portfolioWeight: 0,
  },
  {
    code: 'MPM7006',
    name: 'Project Management Innovations',
    credits: 20,
    hasPresentation: true,
    presentationWeight: 25,
    writtenWeight: 75,
    hasPortfolio: false,
    portfolioWeight: 0,
  },
  {
    code: 'MPM7007',
    name: 'Management of Mega and Complex Projects',
    credits: 20,
    hasPresentation: true,
    presentationWeight: 30,
    writtenWeight: 70,
    hasPortfolio: false,
    portfolioWeight: 0,
  },
  {
    code: 'MPM7008',
    name: 'Capstone Project',
    credits: 40,
    hasPresentation: false,
    presentationWeight: 0,
    writtenWeight: 80,
    hasPortfolio: true,
    portfolioWeight: 20,
  },
];

function getClassification(mark: number): { label: string; color: string } {
  if (mark >= 70) return { label: 'Distinction', color: 'bg-emerald-500' };
  if (mark >= 60) return { label: 'Merit', color: 'bg-blue-500' };
  if (mark >= 50) return { label: 'Pass', color: 'bg-amber-500' };
  return { label: 'Fail', color: 'bg-red-500' };
}

function getModuleStatus(mark: number): { label: string; color: string } {
  if (mark >= 50) return { label: 'Passed', color: 'text-emerald-600' };
  return { label: 'Failed', color: 'text-red-600' };
}

export default function App() {
  const [results, setResults] = useState<ModuleResult[]>(
    modules.map((m) => ({
      code: m.code,
      presentationMark: '',
      writtenMark: '',
      portfolioMark: '',
      overallMark: 0,
    }))
  );

  const updateMark = (
    code: string,
    field: 'presentationMark' | 'writtenMark' | 'portfolioMark',
    value: string
  ) => {
    const numValue = value === '' ? '' : Math.min(100, Math.max(0, parseFloat(value) || 0));
    setResults((prev) =>
      prev.map((r) => (r.code === code ? { ...r, [field]: numValue } : r))
    );
  };

  const calculateOverall = (module: Module, result: ModuleResult): number => {
    let total = 0;
    if (module.hasPresentation && result.presentationMark !== '') {
      total += (result.presentationMark as number) * (module.presentationWeight / 100);
    }
    if (result.writtenMark !== '') {
      total += (result.writtenMark as number) * (module.writtenWeight / 100);
    }
    if (module.hasPortfolio && result.portfolioMark !== '') {
      total += (result.portfolioMark as number) * (module.portfolioWeight / 100);
    }
    return total;
  };

  const calculatedResults = useMemo(() => {
    return results.map((r) => {
      const module = modules.find((m) => m.code === r.code)!;
      return {
        ...r,
        overallMark: calculateOverall(module, r),
      };
    });
  }, [results]);

  const finalWeightedAverage = useMemo(() => {
    let totalWeightedMarks = 0;
    let totalCredits = 0;

    calculatedResults.forEach((r) => {
      const module = modules.find((m) => m.code === r.code)!;
      if (r.writtenMark !== '' || (module.hasPresentation && r.presentationMark !== '')) {
        totalWeightedMarks += r.overallMark * module.credits;
        totalCredits += module.credits;
      }
    });

    return totalCredits > 0 ? totalWeightedMarks / totalCredits : 0;
  }, [calculatedResults]);

  const classification = getClassification(finalWeightedAverage);

  const resetAll = () => {
    setResults(
      modules.map((m) => ({
        code: m.code,
        presentationMark: '',
        writtenMark: '',
        portfolioMark: '',
        overallMark: 0,
      }))
    );
  };

  const completedModules = calculatedResults.filter((r) => r.writtenMark !== '').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            MSc Project Management
          </h1>
          <p className="text-slate-600">GPA Calculator</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-slate-700">Progress</span>
              </div>
              <span className="text-sm text-slate-500">
                {completedModules} of {modules.length} modules
              </span>
            </div>
            <Progress value={(completedModules / modules.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Module Cards */}
        <div className="space-y-4 mb-8">
          {modules.map((module) => {
            const result = calculatedResults.find((r) => r.code === module.code)!;
            const status = getModuleStatus(result.overallMark);

            return (
              <Card
                key={module.code}
                className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white/90 backdrop-blur"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {module.code}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {module.credits} Credits
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        {module.name}
                      </CardTitle>
                    </div>
                    {result.overallMark > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {result.overallMark.toFixed(1)}%
                        </div>
                        <div className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {module.hasPresentation && (
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-600">
                          Presentation ({module.presentationWeight}%)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={result.presentationMark}
                          onChange={(e) =>
                            updateMark(module.code, 'presentationMark', e.target.value)
                          }
                          className="h-10"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-600">
                        Written Assessment ({module.writtenWeight}%)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={result.writtenMark}
                        onChange={(e) =>
                          updateMark(module.code, 'writtenMark', e.target.value)
                        }
                        className="h-10"
                      />
                    </div>
                    {module.hasPortfolio && (
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-600">
                          Portfolio ({module.portfolioWeight}%)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={result.portfolioMark}
                          onChange={(e) =>
                            updateMark(module.code, 'portfolioMark', e.target.value)
                          }
                          className="h-10"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Final Result */}
        {finalWeightedAverage > 0 && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white mb-6">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-6 h-6" />
                    <span className="text-indigo-100 font-medium">Final Classification</span>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-1">
                    {finalWeightedAverage.toFixed(1)}%
                  </div>
                  <div className="text-indigo-100">Weighted Average</div>
                </div>
                <div className="text-right">
                  <Badge
                    className={`${classification.color} text-white text-lg px-4 py-2 font-semibold`}
                  >
                    {classification.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grading Scale Reference */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              Grading Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-emerald-50 rounded-lg p-3 text-center">
                <div className="text-emerald-700 font-bold">70%+</div>
                <div className="text-emerald-600 text-sm">Distinction</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-blue-700 font-bold">60-69%</div>
                <div className="text-blue-600 text-sm">Merit</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-amber-700 font-bold">50-59%</div>
                <div className="text-amber-600 text-sm">Pass</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-red-700 font-bold">0-49%</div>
                <div className="text-red-600 text-sm">Fail</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Minimum 50% required to pass each module. Total 180 credits needed for Master's degree.
            </p>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={resetAll}
            className="flex items-center gap-2 px-6"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Marks
          </Button>
        </div>
      </div>
    </div>
  );
}
