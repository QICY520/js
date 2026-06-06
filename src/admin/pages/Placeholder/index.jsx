import { Card, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function PlaceholderPage({ title }) {
  return (
    <Card bordered={false} className="shadow-sm">
      <Title level={4}>{title}</Title>
      <Paragraph type="secondary">该模块正在开发中，敬请期待。</Paragraph>
    </Card>
  )
}
