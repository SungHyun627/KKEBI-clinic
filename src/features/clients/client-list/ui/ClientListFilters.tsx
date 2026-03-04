import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import type { RiskFilter } from '@/features/clients/client-list/types/client-list';

interface ClientListFiltersProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  riskFilter: RiskFilter;
  setRiskFilter: (value: RiskFilter) => void;
  isRiskFilterInteracted: boolean;
  setIsRiskFilterInteracted: (value: boolean) => void;
  locale: string;
  className?: string;
  labels: {
    searchPlaceholder: string;
    riskType: string;
    all: string;
    riskStable: string;
    riskCaution: string;
    riskHigh: string;
    register: string;
    closedSessions: string;
  };
  onRegisterClick: () => void;
  onClosedClick: () => void;
  onFilterChanged?: () => void;
}

const ClientListFilters = ({
  searchKeyword,
  setSearchKeyword,
  riskFilter,
  setRiskFilter,
  isRiskFilterInteracted,
  setIsRiskFilterInteracted,
  locale,
  labels,
  onRegisterClick,
  onClosedClick,
  onFilterChanged,
}: ClientListFiltersProps) => {
  return (
    <div className="flex w-full items-center justify-between max-[1100px]:flex-col max-[1100px]:items-start max-[1100px]:gap-3">
      <div className="flex w-full min-w-0 flex-1 items-center gap-4">
        <div className="w-full min-w-0 max-w-[416px]">
          <Input
            placeholder={labels.searchPlaceholder}
            className="min-w-0"
            value={searchKeyword}
            onChange={(event) => {
              setSearchKeyword(event.target.value);
              onFilterChanged?.();
            }}
            icon={
              <div
                className="h-6 w-6 bg-current"
                style={{
                  maskImage: 'url(/icons/search.svg)',
                  WebkitMaskImage: 'url(/icons/search.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            }
          />
        </div>
        <Select
          placeholder={labels.riskType}
          value={riskFilter}
          triggerLabel={!isRiskFilterInteracted ? labels.riskType : undefined}
          onValueChange={(value) => {
            setRiskFilter(value as RiskFilter);
            setIsRiskFilterInteracted(true);
            onFilterChanged?.();
          }}
          options={[
            { label: labels.all, value: 'all' },
            { label: labels.riskStable, value: '안정' },
            { label: labels.riskCaution, value: '주의' },
            { label: labels.riskHigh, value: '위험' },
          ]}
          className={locale === 'en' ? 'w-40' : 'w-31'}
        />
      </div>
      <div className="flex items-center gap-3 max-[1100px]:w-full max-[1100px]:justify-start">
        <Button size="sm" onClick={onRegisterClick}>
          {labels.register}
        </Button>
        <Button size="sm" variant="outline" onClick={onClosedClick}>
          {labels.closedSessions}
        </Button>
      </div>
    </div>
  );
};

export default ClientListFilters;
