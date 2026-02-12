interface TitleProps {
  title: string;
}

export const Title = ({ title }: TitleProps) => {
  return <span className="body-20 font-semibold">{title}</span>;
};
