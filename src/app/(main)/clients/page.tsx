import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';

export default function ClientsPage() {
  return (
    <section className="flex flex-col w-full items-start gap-7">
      <div className="flex w-full justify-between items-center">
        <div className="flex w-full flex-1 min-w-0 items-center gap-4">
          <div className="w-full max-w-[416px] min-w-0">
            <Input
              placeholder="내담자 성함을 검색해 보세요."
              className="min-w-0"
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
            placeholder="위험 유형"
            options={[
              { label: '전체', value: 'all' },
              { label: '안정', value: '안정' },
              { label: '주의', value: '주의' },
              { label: '위험', value: '위험' },
            ]}
            className="w-31"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm">내담자 등록</Button>
          <Button size="sm" variant={'outline'}>
            종결 상담 확인
          </Button>
        </div>
      </div>
    </section>
  );
}
