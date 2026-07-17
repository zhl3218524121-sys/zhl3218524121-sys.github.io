#include "stm32f10x.h"
#include "delay.h"

/* =========================== 全局变量声明 =========================== */
extern volatile uint16_t adc_value;           // ADC采集值，在main.c中定义
extern volatile uint8_t  adc_update_flag;    // ADC更新标志
extern volatile uint8_t  alarm_flag;          // 自动报警标志
extern volatile uint8_t  emergency_flag;      // 紧急报警标志（按键触发）
extern volatile uint32_t sys_tick;            // 系统秒计数
extern void Digit_Scan(void);                 // 数码管扫描函数，在main.c中定义

/* =========================== 私有宏定义 =========================== */
#define ALARM_THRESHOLD  2000   // 光照报警阈值（ADC值），低于此值触发报警

/**
 * @brief  TIM2 定时中断服务函数
 * @note   每1秒触发一次，完成以下任务：
 *         1. 启动ADC软件转换
 *         2. 设置adc_update_flag，通知主循环处理
 *         3. 系统滴答计数
 *         4. 串口发送当前状态数据
 *         本中断体现了"定时器"模块的应用。
 */
void TIM2_IRQHandler(void)
{
    if(TIM_GetITStatus(TIM2, TIM_IT_Update) != RESET)
    {
        TIM_ClearITPendingBit(TIM2, TIM_IT_Update);  // 清除中断标志位
        
        /* 1. 启动ADC软件转换 */
        ADC_SoftwareStartConvCmd(ADC1, ENABLE);
        
        /* 2. 设置标志位，通知主循环进行数据处理 */
        adc_update_flag = 1;
        
        /* 3. 系统运行秒数计数 */
        sys_tick++;
        
        /* 4. 串口发送数据：格式 "Lux:xxxx,Alarm:X\r\n"
         *    X=0 表示正常，X=1 表示报警（自动或紧急）
         */
        uint8_t is_alarm = (alarm_flag || emergency_flag) ? 1 : 0;
        uint8_t buf[32];
        uint8_t i = 0;
        
        // 手动构造字符串避免sprintf依赖
        uint16_t lux = adc_value;
        buf[i++] = 'L';
        buf[i++] = 'u';
        buf[i++] = 'x';
        buf[i++] = ':';
        
        // 将ADC数值按十进制分解到缓冲区（最多4位）
        uint8_t digit[4] = {0};
        digit[0] = (lux / 1000) % 10;
        digit[1] = (lux / 100) % 10;
        digit[2] = (lux / 10) % 10;
        digit[3] = lux % 10;
        
        uint8_t started = 0;
        for(uint8_t d = 0; d < 4; d++)
        {
            if(digit[d] != 0 || started || d == 3)
            {
                started = 1;
                buf[i++] = digit[d] + '0';
            }
        }
        
        buf[i++] = ',';
        buf[i++] = 'A';
        buf[i++] = 'l';
        buf[i++] = 'a';
        buf[i++] = 'r';
        buf[i++] = 'm';
        buf[i++] = ':';
        buf[i++] = is_alarm + '0';
        buf[i++] = '\r';
        buf[i++] = '\n';
        
        // 通过USART1发送数据
        for(uint8_t j = 0; j < i; j++)
        {
            USART_SendData(USART1, buf[j]);
            while(USART_GetFlagStatus(USART1, USART_FLAG_TXE) == RESET); // 等待发送寄存器空
        }
    }
}

/**
 * @brief  EXTI0 外部中断服务函数
 * @note   按键下降沿触发，体现"外部中断"模块的应用。
 *         按键接PA0，配置为输入上拉，按下时产生下降沿。
 *         软件延时10ms消抖，防止按键抖动导致多次触发。
 *         每次按键翻转emergency_flag状态（取反）。
 */
void EXTI0_IRQHandler(void)
{
    if(EXTI_GetITStatus(EXTI_Line0) != RESET)
    {
        EXTI_ClearITPendingBit(EXTI_Line0);  // 清除中断标志位
        
        /* 软件消抖：延时10ms后再次检测电平 */
        Delay_ms(10);
        if(GPIO_ReadInputDataBit(GPIOA, GPIO_Pin_0) == Bit_RESET) // 确认按键仍为低电平
        {
            emergency_flag = !emergency_flag;  // 翻转紧急报警标志
        }
    }
}

/**
 * @brief  USART1 中断服务函数（接收中断，可选扩展）
 * @note   若PC端发送字符'1'，强制开启报警；发送'0'，强制关闭报警。
 *         体现"串口通信"的双向交互能力。
 */
void USART1_IRQHandler(void)
{
    uint8_t rx_data;
    if(USART_GetITStatus(USART1, USART_IT_RXNE) != RESET)
    {
        rx_data = USART_ReceiveData(USART1);  // 读取接收数据，自动清除标志
        
        if(rx_data == '1')
        {
            emergency_flag = 1;  // 远程强制报警
        }
        else if(rx_data == '0')
        {
            emergency_flag = 0;  // 远程解除报警
        }
    }
}
