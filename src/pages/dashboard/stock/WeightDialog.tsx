import { setStockWeight } from "@/api/mainApi";
import DialogForm from "@/components/dialog-form";
import RHFInput from "@/components/hook-form/RHFInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, TextField } from "@mui/material";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";
import { Stock } from ".";

interface WeightItem {
    weights?: {
        weight: number;
    }[]
}

interface WeightDialogProps {
    open: boolean;
    onClose: () => void;
    selectedStock: Stock[]
}

const WeightDialog: FC<WeightDialogProps> = ({open, onClose, selectedStock}) => {
    const WeightSchema = Yup.object().shape({
        weights: Yup.array().of(
            Yup.object().shape({
                weight: Yup.number().required('请输入重量').typeError('请输入重量')
            })
        ),
      });

      const values = {
        weights: selectedStock?.map(item => ({weight: item.weight || 0})),
      };
    
      const methods = useForm<WeightItem>({
        resolver: yupResolver(WeightSchema),
        values,
      });
    
      const { handleSubmit, reset, control } = methods;

      const { fields } = useFieldArray({
              control,
              name: 'weights'
            })
    
      const handleClose = () => {
        onClose()
      };
    
      const onSubmit = (data: WeightItem) => {
        const { weights} = data
        const params = selectedStock?.map((mx, index) => ({id: mx.id, weight: Number(weights?.[index].weight)}))
        setStockWeight(params).then(res => {
            if (res.data.code === 200) {
                reset()
                handleClose()
              }
        })
      };
    return <DialogForm title="登记重量" open={open} methods={methods} onSubmit={handleSubmit(onSubmit)} onClose={handleClose}>
        
        {fields?.map((filed,index) => <Stack key={filed.id} sx={{ p: 2 }} spacing={2} direction="row">
            <TextField
                label="吨包号"
                value={selectedStock[index]?.code}
                size="small"
                fullWidth
                InputProps={{
                    readOnly: true,
                }}
            />
            <RHFInput
                label="重量"
                name={`weights.${index}.weight`}
                size="small"
                placeholder="请输入重量"
            />
        </Stack>)}
    </DialogForm>
}

export default WeightDialog